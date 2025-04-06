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


def compare_faces(profiles, other_photos_data, tolerance=0.5, std_factor=0.5):
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





# shit from chat
# def load_and_encode_image(image_path, cache):
#     """
#     Loads an image, detects all faces, and encodes them. Uses cache.
#     Handles potential errors during image loading or processing.
#     """
#     if image_path in cache:
#         logger.debug(f"Cache hit for: {os.path.basename(image_path)}")
#         return cache[image_path]

#     logger.debug(f"Processing image: {os.path.basename(image_path)}")
#     try:
#         image = face_recognition.load_image_file(image_path)
#         face_locations = face_recognition.face_locations(image)
#         face_encodings = face_recognition.face_encodings(image, face_locations)
#         face_sizes = [(bottom - top) * (right - left) for top, right, bottom, left in face_locations]

#         # Cache the processed data
#         cache[image_path] = (face_encodings, face_locations, face_sizes)
#         return face_encodings, face_locations, face_sizes
#     except Exception as e:
#         logger.error(f"Error processing image {image_path}: {e}")
#         # Cache the error result to avoid reprocessing problematic files repeatedly in one run
#         cache[image_path] = ([], [], [])
#         return [], [], []


# def get_average_encoding(image_paths, cache):
#     """
#     Computes the average encoding from multiple profile images.
#     """
#     encodings = []
#     processed_paths = [] # Keep track of which paths contributed encodings

#     for img_path in image_paths:
#          # Ensure the path exists before trying to load
#         if not os.path.exists(img_path):
#             logger.warning(f"Profile image not found: {img_path}")
#             continue
#         try:
#             # Use existing cache if available within load_and_encode_image
#             img_encodings, _, _ = load_and_encode_image(img_path, cache)
#             if img_encodings:
#                 # We might get multiple faces in a profile pic, typically want the largest
#                 # Or average all found? Let's average all for now as per original script.
#                 encodings.extend(img_encodings)
#                 processed_paths.append(os.path.basename(img_path))
#         except Exception as e:
#              logger.error(f"Could not get encoding for {img_path}: {e}")


#     if encodings:
#         logger.info(f"Averaging encodings from: {processed_paths}")
#         encodings_np = np.array(encodings)
#         return np.mean(encodings_np, axis=0)

#     logger.warning(f"No valid encodings found for paths: {[os.path.basename(p) for p in image_paths]}")
#     return None


# def compare_faces_for_profile(profile, other_photo_path, tolerance, std_factor, cache):
#     """
#     Compares a single profile to a single photo, with caching.
#     """
#     if profile.get("profile_encoding") is None:
#         logger.warning(f"Skipping profile {profile.get('profile_id', 'N/A')} due to missing encoding.")
#         return []

#     matches = []
#     profile_encoding = profile["profile_encoding"]

#     # Ensure the photo path exists
#     if not os.path.exists(other_photo_path):
#         logger.warning(f"Photo for comparison not found: {other_photo_path}")
#         return []

#     # Get encoding data for the photo (use cache if available)
#     other_encodings, face_locations, face_sizes = load_and_encode_image(other_photo_path, cache)

#     if not other_encodings:
#         # No faces detected in this photo
#         return matches

#     # Calculate stats only if there are faces
#     if face_sizes:
#         avg_face_size = np.mean(face_sizes)
#         std_face_size = np.std(face_sizes)
#         # Avoid division by zero or nonsensical threshold if only one face
#         threshold = avg_face_size - (std_factor * std_face_size) if len(face_sizes) > 1 else avg_face_size * 0.5 # Heuristic for single face
#     else:
#         threshold = 0 # Should not happen if other_encodings is not empty, but defensive

#     # Compare the profile's encoding with all detected faces in the other photo
#     distances = face_recognition.face_distance(other_encodings, profile_encoding)

#     if distances.size > 0:
#         # Find the best match (smallest distance) for this profile in this photo
#         best_match_index = np.argmin(distances)
#         best_match_distance = distances[best_match_index]
#         best_face_location = face_locations[best_match_index] # (top, right, bottom, left)
#         best_face_size = face_sizes[best_match_index]

#         # Check if the best match is below tolerance
#         if best_match_distance <= tolerance:
#             position = "Close (Main Subject)" if best_face_size >= threshold else "Background"
#             match_data = {
#                 "photo": os.path.basename(other_photo_path),
#                 "position": position,
#                 "distance": round(float(best_match_distance), 4), # Ensure serializable
#                 "location": best_face_location # Provide coordinates
#             }
#             matches.append(match_data)
#             logger.info(f"Match found for {profile['profile_id']} in {os.path.basename(other_photo_path)} - Dist: {match_data['distance']}, Pos: {match_data['position']}")
#         # else:
#         #     logger.debug(f"No match for {profile['profile_id']} in {os.path.basename(other_photo_path)} (best distance {best_match_distance:.4f} > tolerance {tolerance})")


#     return matches

# # --- Service Layer Function ---

# def run_face_recognition(tolerance=None, std_factor=None):
#     """
#     Orchestrates the face recognition process using uploaded files.
#     """
#     config = current_app.config
#     profile_base_folder = config['PROFILE_UPLOAD_FOLDER']
#     bulk_base_folder = config['BULK_UPLOAD_FOLDER']
#     tolerance = tolerance if tolerance is not None else config['DEFAULT_RECOGNITION_TOLERANCE']
#     std_factor = std_factor if std_factor is not None else config['DEFAULT_RECOGNITION_STD_FACTOR']

#     logger.info(f"Starting face recognition. Tolerance={tolerance}, StdFactor={std_factor}")
#     logger.info(f"Profile folder: {profile_base_folder}")
#     logger.info(f"Bulk photo folder: {bulk_base_folder}")

#     profiles_data = []
#     profile_encoding_cache = {} # Cache for profile encodings across the entire run

#     # 1. Load Profiles and Calculate Average Encodings
#     if not os.path.exists(profile_base_folder):
#          logger.error(f"Profile base folder not found: {profile_base_folder}")
#          return {"error": "Profile upload directory missing."}, 500

#     profile_ids = [d for d in os.listdir(profile_base_folder) if os.path.isdir(os.path.join(profile_base_folder, d))]
#     if not profile_ids:
#         logger.warning("No profile subdirectories found.")
#         return {"message": "No profiles found to process."}, 200

#     logger.info(f"Found profile IDs: {profile_ids}")

#     for profile_id in profile_ids:
#         profile_img_folder = os.path.join(profile_base_folder, profile_id)
#         image_files = [os.path.join(profile_img_folder, f)
#                        for f in os.listdir(profile_img_folder)
#                        if os.path.isfile(os.path.join(profile_img_folder, f)) and \
#                           f.lower().endswith(('.png', '.jpg', '.jpeg'))]

#         if not image_files:
#             logger.warning(f"No images found for profile ID: {profile_id}")
#             continue

#         logger.info(f"Calculating encoding for profile: {profile_id} using {len(image_files)} image(s)")
#         # Pass the profile encoding cache to get_average_encoding
#         avg_encoding = get_average_encoding(image_files, profile_encoding_cache)

#         profiles_data.append({
#             "profile_id": profile_id,
#             "profile_encoding": avg_encoding,
#             "inside_photos": [] # Initialize list for matches
#         })

#     # Check if any profiles have valid encodings
#     valid_profiles = [p for p in profiles_data if p["profile_encoding"] is not None]
#     if not valid_profiles:
#         logger.warning("No profiles with valid encodings could be processed.")
#         # Return original profiles_data so user knows which profiles failed
#         return {"message": "No profiles with valid face encodings found.", "profiles_processed": profiles_data}, 200


#     # 2. List Bulk Photos
#     if not os.path.exists(bulk_base_folder):
#          logger.error(f"Bulk photo base folder not found: {bulk_base_folder}")
#          return {"error": "Bulk photo upload directory missing."}, 500

#     other_photos_paths = [os.path.join(bulk_base_folder, f)
#                            for f in os.listdir(bulk_base_folder)
#                            if os.path.isfile(os.path.join(bulk_base_folder, f)) and \
#                               f.lower().endswith(('.png', '.jpg', '.jpeg'))]

#     if not other_photos_paths:
#         logger.warning("No bulk photos found for comparison.")
#         return {"message": "No bulk photos found to process.", "profiles_processed": profiles_data}, 200

#     logger.info(f"Found {len(other_photos_paths)} bulk photos for comparison.")

#     # 3. Compare Each Profile Against Each Bulk Photo
#     # We use a separate cache per bulk photo comparison to manage memory as in the original script
#     for photo_path in other_photos_paths:
#         photo_cache = {} # Cache for this specific photo's encodings
#         logger.info(f"--- Comparing against: {os.path.basename(photo_path)} ---")
#         for profile in valid_profiles: # Only compare profiles with valid encodings
#             matches = compare_faces_for_profile(profile, photo_path, tolerance, std_factor, photo_cache)
#             if matches:
#                 profile["inside_photos"].extend(matches)
#         # photo_cache.clear() # Explicitly clear cache for the photo (though it goes out of scope anyway)

#     logger.info("Face recognition process completed.")

#     # Prepare final results (excluding the bulky encoding)
#     results = []
#     for p in profiles_data:
#         results.append({
#             "profile_id": p["profile_id"],
#             "found_in": p["inside_photos"],
#              "processed_successfully": p["profile_encoding"] is not None
#         })

#     return {"recognition_results": results}, 200