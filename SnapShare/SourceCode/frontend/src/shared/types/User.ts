export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
  profilePhotosEncoding: number[];
  hashedPassword: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}