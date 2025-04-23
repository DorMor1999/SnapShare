import { Request, Response } from "express";
import { createUserService, deleteUserByIdService, updateUserByIdService } from "../services/user.service";
import { getUserByEmailService } from "../services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserDto } from "../models/dtos/user.dto";
import { IUser } from "../models/user.model";
import { encodePhoto } from "../services/faceRecognition.service";
import { FaceRecognitionEncodeResponse } from "../models/api-responses/faceRecognitionEncode.response";
import { uploadProfilePhotosToBlobStorage } from "../services/photoStorage.service";
import { mapDtoToUser } from "../mappers/user.mapper";
// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;
        const user: IUserDto = {
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
            phoneNumber,
            profilePhotosUrls: [],
            profilePhotosEncoding: [],
          };
        const files = req.files as Express.Multer.File[];
        
        // Create the user
        let userToCreate: Partial<IUser> = mapDtoToUser(user); // Map the DTO to the user model
        const newUser: IUser = await createUserService(userToCreate);
        
        // Upload files to Azure Blob Storage
        const uploadedPhotoUrls = await uploadProfilePhotosToBlobStorage(newUser._id, files, process.env.AZURE_STORAGE_CONTAINER_NAME_PROFILE_PHOTOS || "");
        if (!uploadedPhotoUrls) {
            res.status(500).json({ message: "Failed to upload photos" });
            return;
        }
        newUser.profilePhotosUrls = uploadedPhotoUrls;
        // encode + upload
        let encodingResponse: FaceRecognitionEncodeResponse | undefined = await encodePhoto(files, newUser._id.toString());
        if (encodingResponse) {        
            newUser.profilePhotosEncoding = encodingResponse.data.encoding;
        }
        
        let updatedUser: IUser|null = await updateUserByIdService(newUser._id.toString(), newUser); // Update the user with the encoding data
        if(updatedUser == null) {
            await deleteUserByIdService(newUser._id.toString()); 
            res.status(500).json({ message: "Failed to update user with encoding data" });
            return;
        }

        res.status(201).json({ message: "User registered successfully", user: newUser });
        return;
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY || "secret", {
            expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
        });

        res.status(200).json({ message: "Login successful", token, id: user._id }); 
    } catch (error) {
        res.status(500).json({ message: "Failed to login", error });
    }
};