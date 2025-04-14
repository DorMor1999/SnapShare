import mongoose from "mongoose";

export interface IUserDto {
  firstName: string;
  lastName: string;
  email: string;
  profileImageIds: mongoose.Types.ObjectId[] | any; // Exposes profileImageIds as an array
  password: string; // Changed to lowercase "password" for consistency
  phoneNumber: string;
}