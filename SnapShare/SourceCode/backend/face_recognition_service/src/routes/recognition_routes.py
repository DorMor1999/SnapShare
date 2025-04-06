from flask import Blueprint, request, jsonify, current_app
#from services.recognition_service import run_face_recognition    chat staff

recognition_bp = Blueprint('recognition_bp', __name__, url_prefix='/recognize')

@recognition_bp.route('/', methods=['POST'])
def trigger_recognition():
    """
    Triggers the face recognition process on uploaded profiles and bulk photos.
    Accepts 'event_photos_keys' and 'user_encodes' (array of dictionaries containing 'user_id' and 'encode') in the JSON body.
    """
    data = request.get_json() or {}
    event_photos_keys = data.get('event_photos_keys')  # Array of photo keys
    user_encodes = data.get('user_encodes')  # Array of dictionaries containing 'user_id' and 'encode'

    # Validate if 'event_photos_keys' is a list
    if not isinstance(event_photos_keys, list):
        return jsonify({"error": "'event_photos_keys' must be an array"}), 400

    # Validate if user_encodes is a list of dictionaries with 'user_id' and 'encode' keys
    if not isinstance(user_encodes, list) or not all(isinstance(item, dict) and 'user_id' in item and 'encode' in item for item in user_encodes):
        return jsonify({"error": "'user_encodes' must be an array of dictionaries containing 'user_id' and 'encode'"}), 400

    #need to add here the part we get all photos from storage

    # Call face recognition function with the provided event_photos_keys and user_encodes
    results, status_code = run_face_recognition(
        event_photos_keys=event_photos_keys,
        user_encodes=user_encodes
    )

    return jsonify(results), status_code