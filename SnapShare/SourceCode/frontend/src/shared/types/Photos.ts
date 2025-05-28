export type Photo = {
  _id: string;
  eventId: string;
  url: string;
  photoGroups: any[]; // Update this if you know the exact structure
  userIds: string[];
  uploadedAt: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
};

export type PhotoArray = Photo[];

export type PhotoPositionType = "Close (Main Subject)" | "Background";
