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

#dor staff
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
    face_sizes = [(bottom - top) * (right - left) for top, right, bottom, left in face_locations]  # Calculate face sizes

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

## less efficent
def compare_faces_for_profile(profile, other_photo_data, tolerance=0.5, std_factor=0.5, cache={}):
    """
    Compares a single profile to a single photo, with caching of encodings.

    Args:
        profile (dict): The profile to compare.
        other_photo_data (bytes): The photo data (in bytes) for comparison.
        tolerance (float): Threshold for the match distance.
        std_factor (float): Factor to define a threshold based on face size variability.
        cache (dict): Cache to store previously processed photos.

    Returns:
        list: A list of matches found for the profile in the photo.
    """
    if profile["profile_encoding"] is None:
        return []  # Return empty list if no valid face encoding in profile

    matches = []  # List to store match results
    
    # Get the encoding data for the photo (use cache if available)
    other_encodings, face_locations, face_sizes = load_and_encode_photo(other_photo_data, cache)

    if not other_encodings:
        return matches  # Skip if no faces found in the photo

    # Calculate mean and standard deviation of face sizes in the photo
    avg_face_size = np.mean(face_sizes)
    std_face_size = np.std(face_sizes)

    # Define threshold based on face size variability
    threshold = avg_face_size - (std_factor * std_face_size)

    # Compare the profile's encoding with all detected faces
    distances = face_recognition.face_distance(other_encodings, profile["profile_encoding"])
    
    if distances.size > 0:  # Check if distances array is not empty
        best_match_index = np.argmin(distances)
        best_match_distance = distances[best_match_index]
        best_face_size = face_sizes[best_match_index]

        # Determine if the face is close or in the background based on size
        position = "Close (Main Subject)" if best_face_size >= threshold else "Background"

        if best_match_distance < tolerance:
            matches.append({"photo": other_photo_data, "position": position, "distance": best_match_distance})
    
    return matches  # Return the list of matches


def compare_faces1(profiles, other_photos_data, tolerance=0.5, std_factor=0.5):
    """
    Compares multiple profiles to multiple faces in other photos, using caching.

    Args:
        profiles (list): List of profiles to compare.
        other_photos_data (list): List of photo data (in bytes) to compare against.
        tolerance (float): Threshold for the match distance.
        std_factor (float): Factor to define a threshold based on face size variability.
    """
    cache = {}  # Initialize cache for photos
    
    for photo_data in other_photos_data:
        for profile in profiles:
            matches = compare_faces_for_profile(profile, photo_data, tolerance, std_factor, cache)
            profile["inside_photos"] = profile.get("inside_photos", []) + matches  # Store the matches for each profile
        
        # Clear cache after processing each photo
        cache.clear()

## less efficent



## more efficent
def compare_faces2(profiles, other_photos_data, tolerance=0.5, std_factor=0.5):
    """
    Compares multiple profiles to multiple faces in other photos.
    Detects and encodes faces once per photo, then compares all to all profiles.

    Args:
        profiles (list): List of profiles to compare, each with 'profile_encoding'.
        other_photos_data (list): List of photo data (in bytes) to compare against.
        tolerance (float): Threshold for the match distance.
        std_factor (float): Factor to define a threshold based on face size variability.
    """
    cache = {}

    for photo_data in other_photos_data:
        # Step 1: Detect and encode faces in the current photo (once)
        other_encodings, face_locations, face_sizes = load_and_encode_photo(photo_data, cache)

        if not other_encodings:
            continue

        # Step 2: Compute face size threshold for position classification
        avg_face_size = np.mean(face_sizes)
        std_face_size = np.std(face_sizes)
        threshold = avg_face_size - (std_factor * std_face_size)

        # Step 3: For each detected face in the photo, compare it with all profiles
        for encoding_index, face_encoding in enumerate(other_encodings):
            face_size = face_sizes[encoding_index]

            for profile in profiles:
                profile_encoding = profile.get("profile_encoding")
                if profile_encoding is None:
                    continue

                distance = face_recognition.face_distance([face_encoding], profile_encoding)[0]

                if distance < tolerance:
                    position = "Close (Main Subject)" if face_size >= threshold else "Background"
                    match = {
                        "photo": photo_data,
                        "position": position,
                        "distance": distance
                    }
                    profile.setdefault("inside_photos", []).append(match)

        cache.clear()
## more efficent
