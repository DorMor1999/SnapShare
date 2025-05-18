import User, { IUser } from "../models/user.model";

// Fetch all users
export const fetchAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

// Fetch a user by ID
export const fetchUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

// Create a new user
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  // Check if a user with the same email already exists
  const existingUser = await fetchUserByEmail(userData.email!);
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const user = new User(userData);
  return await user.save();
};

// Update a user by ID
export const updateUserById = async (
  id: string,
  updatedData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a user by ID
export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

// Fetch a user by email
export const fetchUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const getUsersByIds = async (ids: string[]): Promise<IUser[]> => {
  return await User.find({ _id: { $in: ids } });
};