import { Types } from "mongoose";
import { Photo, IPhoto } from "../models/photo.model";

export const savePhoto = async (eventId: string, url: string): Promise<IPhoto> => {
  try {
    const photo = new Photo({ eventId, url });
    return await photo.save();
  } catch (error) {
    console.error("Error saving photo to the database:", error);
    throw new Error("Failed to save photo to the database");
  }
};

export const saveBulkPhotos = async (
  photos: Partial<IPhoto>[]
): Promise<Partial<IPhoto>[]> => {
  try {
    return await Photo.insertMany(photos);
  } catch (error) {
    console.error("Error saving bulk photos to the database:", error);
    throw new Error("Failed to save bulk photos to the database");
  }
};

export const getPhotosByEventId = async (eventId: string): Promise<IPhoto[]> => {
  try {
    return await Photo.find({ eventId });
  } catch (error) {
    console.error("Error retrieving photos by eventId:", error);
    throw new Error("Failed to retrieve photos by eventId");
  }
};

export const getPhotosByIds = async (photoIds: string[]): Promise<IPhoto[]> => {
  try {
    return await Photo.find({ _id: { $in: photoIds } });
  } catch (error) {
    console.error("Error retrieving photos by IDs:", error);
    throw new Error("Failed to retrieve photos by IDs");
  }
};

export const updatePhotoUserIds = async (
  photoId: string,
  userIds: Types.ObjectId[],
  session?: any
): Promise<IPhoto | null> => {
  return await Photo.findByIdAndUpdate(
    photoId,
    { $addToSet: { userIds: { $each: userIds } } }, // Add userIds to the list
    { new: true, session }, // Use session for transaction
  ).exec();
};

export const removePhotoUserIds = async (
  photoId: string, userIds: Types.ObjectId[], session?: any
): Promise<IPhoto | null> => {
  return await Photo.findByIdAndUpdate(
    photoId,
    { $pull: { userIds: { $in: userIds } } }, // Remove userIds from the list
    { new: true, session }
  ).exec();
};

export const getPhotoByIdWithUsers = async (photoId: string) => {
  return await Photo.findById(photoId)
    .populate({
      path: "userIds",
      select: "_id firstName lastName email profilePhotosUrls"
    })
    .exec();
};

export const getPhotosWithUserPositionsInEvent = async (
  eventId: string,
  userId: string
) => {
  const userObjectId = new Types.ObjectId(userId);

  const photosWithUserPositions = await Photo.aggregate([
    {
      $match: { eventId }
    },
    {
      $lookup: {
        from: "photousers",
        let: { photoId: "$_id" },
        pipeline: [
          { $unwind: "$photoTags" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$photoTags.photoId", "$$photoId"] },
                  { $eq: ["$userId", userObjectId] }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              userId: 1,
              position: "$photoTags.position"
            }
          }
        ],
        as: "userPositions"
      }
    },
    {
      $match: {
        userPositions: { $ne: [] }
      }
    }
  ]);

  return photosWithUserPositions;
};


export const getPhotoById = async (photoId: string): Promise<IPhoto> => {
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new Error("Photo not found");
    }
    return photo;
  } catch (error) {
    console.error("Error retrieving photo by ID:", error);
    throw new Error("Failed to retrieve photo by ID");
  }
};