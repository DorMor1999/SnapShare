# recognition_service

This Python file implements a face recognition system using the `face_recognition` library, which detects, encodes, and compares faces in photos. It integrates with Flask and is optimized with caching for efficiency.

## Features:

- **Face Detection & Encoding**: Detects faces in photos and generates face encodings.
- **Profile Comparison**: Compares detected faces with pre-stored profile encodings.
- **Position Classification**: Classifies faces as the main subject or background based on size.
- **Caching**: Caches processed photo data to improve performance.

## Functions:

### 1. `load_and_encode_photo(photo_data, cache)`
Detects faces in a photo, encodes them, and caches the result.

### 2. `get_average_encoding(photo_data_list, cache)`
Computes the average encoding from multiple photos.

### 3. `compare_faces(profiles, other_photos_data, tolerance=0.5, std_factor=0.5)`
Compares multiple profiles to faces in new photos and returns the results, including matched photos and position classification. This is done by:

- Detecting faces and encoding them from the new photos.
- Calculating the distance between each detected face and the profile encodings.
- If the distance is below the set tolerance, it's considered a match.
- The face's size is used to classify whether it's the main subject (close) or part of the background (distant).

## Example Usage:

```python
# Example profiles and photos
profiles = [{"user_id": 1, "profile_encoding": [0.12, -0.34, ...]}]
other_photos_data = [{"photo_bytes": photo_bytes_1, "photo_key": "photo1"}]

# Compare profiles to photos
recognition_results = compare_faces(profiles, other_photos_data)

# Example output format
for result in recognition_results:
    print(f"User {result['user_id']} matched in photos:")
    for match in result["inside_photos"]:
        print(f"- Photo Key: {match['photo_key']}, Position: {match['position']}, Distance: {match['distance']}")
```

## Logging:
Logs system activities for transparency (e.g., cache usage).

## Notes:
- **Tolerance**: Determines how strict the face match should be.
- **Position Classification**: Classifies faces based on their size in the photo.

This system is suitable for applications like user authentication or security photo matching.