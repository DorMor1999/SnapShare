export type RecognizedPhoto = {
    photoId: string;
    relevance: string;
};

export interface FaceRecognitionRecognizeResponse {
    userId: string;
    photos: RecognizedPhoto[];
}