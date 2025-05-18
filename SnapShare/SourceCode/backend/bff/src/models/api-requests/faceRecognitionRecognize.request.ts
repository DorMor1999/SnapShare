export type EventPhotoKey = {
    photoId: string;
    photoUrl: string;
};

export type UserEncode = {
    userId: string;
    encoding: number[];
};

export interface FaceRecognitionRecognizeRequest {
    'event_photos_keys': Array<EventPhotoKey>;
    'users_encodes': Array<UserEncode>;
}