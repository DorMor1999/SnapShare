import {
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUserById,
  } from "../dal/user.dal";
  import { IUser } from "../models/user.model";
  
  // Get all users
  export const getAllUsersService = async (): Promise<IUser[]> => {
    return await fetchAllUsers();
  };
  
  // Get a specific user by ID
  export const getUserByIdService = async (id: string): Promise<IUser | null> => {
    return await fetchUserById(id);
  };
  
  // Create a new user
  export const createUserService = async (userData: Partial<IUser>): Promise<IUser> => {
    return await createUser(userData);
  };
  
  // Update a user by ID
  export const updateUserByIdService = async (
    id: string,
    updatedData: Partial<IUser>
  ): Promise<IUser | null> => {
    return await updateUserById(id, updatedData);
  };
  
  // Delete a user by ID
  export const deleteUserByIdService = async (id: string): Promise<IUser | null> => {
    return await deleteUserById(id);
  };