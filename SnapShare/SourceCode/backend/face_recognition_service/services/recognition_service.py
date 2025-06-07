import cv2
import face_recognition
import numpy as np
import os
import logging
from PIL import Image
from flask import current_app
from io import BytesIO

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Core Face Recognition Logic ---

def load_and_encode_photo(photo_data, cache):
    """
    Loads a photo from binary data, detects all faces, and encodes them.

    Args:
        photo_data (bytes): Photo data in bytes.
        cache (dict): Cache to store already processed photo data.

    Returns:
        tuple: A tuple containing:
            - List of face encodings
            - List of face locations
            - List of face sizes
    """
    photo_hash = hash(photo_data)
    if photo_hash in cache:
        return cache[photo_hash]
    print("Photo not in cache")
    # Convert photo data to a photo object
    photo = Image.open(BytesIO(photo_data)).convert('RGB')
    photo_array = np.array(photo).astype(np.uint8)

    face_locations = face_recognition.face_locations(photo_array)
    face_encodings = face_recognition.face_encodings(photo_array, face_locations)
    face_sizes = [(bottom - top) * (right - left) for top, right, bottom, left in face_locations]

    cache[photo_hash] = (face_encodings, face_locations, face_sizes)
    return face_encodings, face_locations, face_sizes


def get_average_encoding(photo_data_list, cache):
    """
    Computes the average encoding from multiple profile photos.

    Args:
        photo_data_list (list): List of photo data (in bytes).
        cache (dict): Cache to store already processed photo data.

    Returns:
        np.ndarray: The average encoding of all detected faces in the photos.
    """
    encodings = []
    for photo_data in photo_data_list:
        photo_encodings, _, _ = load_and_encode_photo(photo_data, cache)
        if photo_encodings:
            encodings.extend(photo_encodings)

    return np.mean(encodings, axis=0) if encodings else None


def compare_faces(profiles, other_photos_data, tolerance=0.5, std_factor=0.4):
    """
    Compares profile encodings to all detected faces in other photos.
    Detects and encodes faces once per photo, then compares each to all profiles.

    Args:
        profiles (list): List of profiles with 'userId' and 'encoding' (average encoding).
        other_photos_data (list): List of dicts with 'photo_bytes', 'photo_key', 'photo_id'.
        tolerance (float): Threshold for face matching.
        std_factor (float): Controls main subject vs background classification.

    Returns:
        list: A list of dicts with 'userId' and their matched 'photos'.
    """
    recognition_results = []
    cache = {}

    for photo_data in other_photos_data:
        photo_bytes = photo_data.get('photo_bytes')
        if not photo_bytes:
            logger.warning("Missing 'photo_bytes' in photo data.")
            continue

        encodings, _, sizes = load_and_encode_photo(photo_bytes, cache)
        if not encodings:
            logger.info("No faces found in a photo.")
            continue

        avg_size = np.mean(sizes)
        std_size = np.std(sizes)
        size_threshold = avg_size - (std_factor * std_size)

        for idx, encoding in enumerate(encodings):
            current_size = sizes[idx]
            for profile in profiles:
                profile_encoding = np.array(profile.get("encoding"))
                if profile_encoding is None:
                    continue

                dist = face_recognition.face_distance([encoding], profile_encoding)[0]
                if dist < tolerance:
                    match_info = {
                        "photo_key": photo_data.get("photo_key"),
                        "photo_id": photo_data.get("photo_id"),
                        "position": "Close (Main Subject)" if current_size >= size_threshold else "Background",
                        "distance": dist,
                    }

                    user_id = profile.get("userId")
                    existing = next((r for r in recognition_results if r["userId"] == user_id), None)

                    if not existing:
                        recognition_results.append({
                            "userId": user_id,
                            "photos": [match_info]
                        })
                    else:
                        existing["photos"].append(match_info)

        cache.clear()

    return recognition_results
