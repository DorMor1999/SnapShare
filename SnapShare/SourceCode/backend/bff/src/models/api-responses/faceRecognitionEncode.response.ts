export interface FaceRecognitionEncodeResponse {
    data: {
        encoding: number[];
        user_id: string;
    };
    message: string;
}