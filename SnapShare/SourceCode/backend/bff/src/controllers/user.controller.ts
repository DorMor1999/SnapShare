import { Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserByIdService,
  deleteUserByIdService,
} from "../services/user.service";
import { mapUserToDto, mapUsersToDtos, mapDtoToUser } from "../mappers/user.mapper";

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    const userDtos = mapUsersToDtos(users);
    res.status(200).json(userDtos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Get a specific user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userDto = mapUserToDto(user);
    res.status(200).json(userDto);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = mapDtoToUser(req.body);
    const newUser = await createUserService(userData);
    const newUserDto = mapUserToDto(newUser);
    res.status(201).json(newUserDto);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = mapDtoToUser(req.body);
    const updatedUser = await updateUserByIdService(id, updatedData);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const updatedUserDto = mapUserToDto(updatedUser);
    res.status(200).json(updatedUserDto);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserByIdService(id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const deletedUserDto = mapUserToDto(deletedUser);
    res.status(200).json(deletedUserDto);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};