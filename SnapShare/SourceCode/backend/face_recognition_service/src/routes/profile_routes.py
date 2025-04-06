from flask import Blueprint, request, jsonify, current_app
import os
from utils.file_helpers import save_file
import numpy as np
from services.recognition_service import get_average_encoding

profile_bp = Blueprint('profile_bp', __name__, url_prefix='/profiles')

@profile_bp.route('/<string:user_id>/encode', methods=['POST'])
def encode_profile_photos(user_id):
    """
    encodes one or more photos for a specific profile ID.
    """
    if 'files[]' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    files = request.files.getlist('files[]')
    if not files or files[0].filename == '':
        return jsonify({"error": "No selected files"}), 400

    photos = []

    # Read image files and store as byte data
    for file in files:
        try:
            # Read file as bytes
            img_data = file.read()
            photos.append(img_data)
        except Exception as e:
            return jsonify({"error": f"Invalid image format: {str(e)}"}), 400
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")         
    print(f"photos are : {photos}")  
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")         

    # Compute average encoding
    avg_encoding = get_average_encoding(photos, {})

    if avg_encoding is None:
        return jsonify({"error": "No faces detected in the photos"}), 400

    #avg_encoding = np.array(avg_encoding, dtype=float)  # Ensure float type
    data = {
        "encoding": avg_encoding.tolist(),
        "user_id": user_id,
    }

    return jsonify({"message": "Encodings generated successfully", "data": data}), 200
