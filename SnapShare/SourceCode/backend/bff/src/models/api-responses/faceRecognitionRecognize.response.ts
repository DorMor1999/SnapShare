export type RecognizedPhoto = {
    photo_id: string;
    position: string;
};

export interface FaceRecognitionRecognize {
    userId: string;
    photos: RecognizedPhoto[];
}

export interface FaceRecognitionRecognizeResponse {
    message: string;
    recognition_results: FaceRecognitionRecognize[];
}