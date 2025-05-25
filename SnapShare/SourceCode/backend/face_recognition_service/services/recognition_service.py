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


# --- Core Face Recognition Logic (Adapted from your script) ---

# dor staff
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
    # Check if photo data is already in cache
    photo_hash = hash(photo_data)
    if photo_hash in cache:
        return cache[photo_hash]
    print("Photo not in cache")

    # Convert photo data to a photo object
    photo = Image.open(BytesIO(photo_data)).convert('RGB')  # ✅ Ensure RGB format
    photo_array = np.array(photo).astype(np.uint8)  # ✅ Ensure 8-bit depth

    face_locations = face_recognition.face_locations(photo_array)  # Detect all faces
    face_encodings = face_recognition.face_encodings(photo_array, face_locations)  # Encode all faces
    face_sizes = [(bottom - top) * (right - left) for top, right, bottom, left in
                  face_locations]  # Calculate face sizes

    # Cache the processed data
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
        # Ensure only valid encodings are added
        if photo_encodings:
            encodings.extend(photo_encodings)  # Collect all face encodings

    if encodings:
        encodings = np.array(encodings)  # Convert list to NumPy array
        return np.mean(encodings, axis=0)  # Compute mean encoding

    return None  # Return None if no valid encodings were found


def compare_faces(profiles, other_photos_data, tolerance=0.5, std_factor=0.5):
    """
    Compares multiple profiles to multiple faces in other photos.
    Detects and encodes faces once per photo, then compares each detected face to all profiles.
    Results are returned in a separate 'recognition_results' array containing user_id and matched photos.

    Args:
        profiles (list): List of profiles to compare, each containing 'encoding' and 'user_id'.
        other_photos_data (list): List of photo data (dicts) to compare against,
                                  each containing 'photo_bytes' and 'photo_key'.
        tolerance (float): Threshold for the match distance.
        std_factor (float): Factor to define a threshold based on face size variability.

    Returns:
        list: A list of dictionaries with 'user_id' and their 'inside_photos' matches.
    """

    recognition_results = []  # This will store the results with 'user_id' and 'inside_photos' for each user
    cache = {}

    for photo_data in other_photos_data:
        # Extract the photo bytes from the dictionary
        photo_bytes = photo_data.get('photo_bytes')
        if not photo_bytes:
            print("No photo bytes found in the data.")
            continue  # Skip if no photo bytes are available

        # Step 1: Detect and encode faces in the current photo (once)
        other_encodings, face_locations, face_sizes = load_and_encode_photo(photo_bytes, cache)

        if not other_encodings:
            print("No faces detected in the photo.")
            continue

        # Step 2: Compute face size threshold for position classification
        avg_face_size = np.mean(face_sizes)
        std_face_size = np.std(face_sizes)
        threshold = avg_face_size - (std_factor * std_face_size)

        # Step 3: For each detected face in the photo, compare it with all profiles
        for encoding_index, face_encoding in enumerate(other_encodings):
            face_size = face_sizes[encoding_index]

            for profile in profiles:
                profile_encoding = profile.get("encoding")
                if profile_encoding is None:
                    continue

                # Convert the lists to numpy arrays before calculating the distance
                face_encoding = np.array(face_encoding)
                profile_encoding = np.array(profile_encoding)

                distance = face_recognition.face_distance([face_encoding], profile_encoding)[0]

                if distance < tolerance:
                    position = "Close (Main Subject)" if face_size >= threshold else "Background"
                    match = {
                        "photo_key": photo_data.get("photo_key"),
                        "position": position,
                        "distance": distance,
                        "photo_id": photo_data.get("photo_id"),
                    }

                    # Find if the user already exists in recognition_results
                    user_id = profile.get("userId")
                    result = next((item for item in recognition_results if item["userId"] == user_id), None)

                    if result is None:
                        # If the user doesn't exist in the results, create a new entry
                        recognition_results.append({
                            "userId": user_id,
                            "photos": [match]
                        })
                    else:
                        # Otherwise, append the match to the existing user's "inside_photos"
                        result["photos"].append(match)

        cache.clear()

    return recognition_results  # Return the recognition results array containing user-specific matches