from flask import Blueprint, request, jsonify, current_app

from services.recognition_service import compare_faces
from services.storage_services import get_Photos

recognition_bp = Blueprint('recognition_bp', __name__, url_prefix='/events')

@recognition_bp.route('/<string:event_id>/recognize', methods=['POST'])
def trigger_recognition(event_id):
    """
    Triggers the face recognition process on uploaded profiles and bulk photos.
    Accepts 'event_photos_keys', 'users_encodes' (array of dictionaries containing 'userId' and 'encoding'),
    and 'event_id' in the JSON body.
    """
    data = request.get_json() or {}

    # Validate if event_id is present
    if not event_id:
        return jsonify({"error": "'event_id' is required"}), 400

    event_photos_keys = data.get('event_photos_keys')  # Array of photo keys
    users_encodes = data.get('users_encodes')  # Array of dictionaries containing 'userId' and 'encode'
    # Validate if 'event_photos_keys' is a list
    if not isinstance(event_photos_keys, list):
        return jsonify({"error": "'event_photos_keys' must be an array"}), 400

    # Validate if user_encodes is a list of dictionaries with 'userId' and 'encoding' keys
    if not isinstance(users_encodes, list) or not all(isinstance(item, dict) and 'userId' in item and 'encoding' in item for item in users_encodes):
        return jsonify({"error": "'users_encodes' must be an array of dictionaries containing 'userId' and 'encoding'"}), 400

    try:
        # Getting event photos - List of dicts to compare against, each containing 'photo_bytes' and 'photo_key'.
        event_photos = get_Photos(event_photos_keys, event_id)

        # Check if event_photos is empty or None
        if not event_photos:
            raise ValueError("No photos found for the event.")

        # Validate that each photo data contains both 'photo_bytes' and 'photo_key'
        for photo in event_photos:
            if not isinstance(photo, dict) or 'photo_bytes' not in photo or 'photo_key' not in photo:
                raise ValueError("Invalid photo data format. Each photo must contain 'photo_bytes' and 'photo_key'.")
    except Exception as e:
        print(str(e))
        return jsonify({"error": "Error getting event photos."}), 500

    try:
        # Start recognition process
        recognition_results = compare_faces(profiles=users_encodes, other_photos_data=event_photos)
    except Exception as e:
        print(str(e))
        return jsonify({"error": "Error during face recognition."}), 500

    response_data = {"recognition_results": recognition_results, "message": "Face recognition process work successfully."}
    return jsonify(response_data), 200