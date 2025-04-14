import { IUser } from "../models/user.model";
import { IUserDto } from "../models/dtos/user.dto";

// Map IUser to IUserDto
export const mapUserToDto = (user: IUser): IUserDto => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImageIds: user.profileImageIds,
    password: user.hashedPassword, // Map hashedPassword to password
    phoneNumber: user.phoneNumber,
  };
};

// Map an array of IUser to an array of IUserDto
export const mapUsersToDtos = (users: IUser[]): IUserDto[] => {
  return users.map(mapUserToDto);
};

// Map IUserDto to IUser
export const mapDtoToUser = (dto: IUserDto): Partial<IUser> => {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    profileImageIds: dto.profileImageIds,
    hashedPassword: dto.password, // Map password back to hashedPassword
    phoneNumber: dto.phoneNumber,
  };
};

// Map an array of IUserDto to an array of IUser
export const mapDtosToUsers = (dtos: IUserDto[]): Partial<IUser>[] => {
  return dtos.map(mapDtoToUser);
};