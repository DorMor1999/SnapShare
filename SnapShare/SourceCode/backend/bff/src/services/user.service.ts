
import * as UserDAL from "../dal/user.dal";
import { IUser } from "../models/user.model";

// Get all users
export const getAllUsers = async (): Promise<IUser[]> => {
  return await UserDAL.fetchAllUsers();
};

// Get a specific user by ID
export const getUserById = async (id: string): Promise<IUser | null> => {
  return await UserDAL.fetchUserById(id);
};

// Create a new user
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return await UserDAL.createUser(userData);
};

// Update a user by ID
export const updateUserById = async (
  id: string,
  updatedData: Partial<IUser>
): Promise<IUser | null> => {
  return await UserDAL.updateUserById(id, updatedData);
};

// Delete a user by ID
export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await UserDAL.deleteUserById(id);
};

// Fetch a user by email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await UserDAL.fetchUserByEmail(email);
};

export const getUsersByUserIds = async (userIds: string[]): Promise<IUser[]> => {
  return await UserDAL.getUsersByIds(userIds);
};