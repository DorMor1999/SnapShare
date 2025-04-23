import mongoose from "mongoose";

export interface IUserDto {
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[];
  profilePhotosEncoding: number[];
  password: string;
  phoneNumber: string;
}