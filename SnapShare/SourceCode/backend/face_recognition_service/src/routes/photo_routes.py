from flask import Blueprint, request, jsonify, current_app
import os
from utils.file_helpers import save_file

photo_bp = Blueprint('photo_bp', __name__, url_prefix='/photos')

@photo_bp.route('/upload', methods=['POST'])
def upload_bulk_photos():
    """
    Uploads one or more bulk photos for recognition.
    Images are saved in uploads/bulk/
    """
    if 'files[]' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    files = request.files.getlist('files[]')
    if not files or files[0].filename == '':
         return jsonify({"error": "No selected files"}), 400

    saved_files = []
    errors = []
    bulk_folder = current_app.config['BULK_UPLOAD_FOLDER']

    for file in files:
        file_path = save_file(file, bulk_folder) # No subfolder needed here
        if file_path:
            saved_files.append(os.path.basename(file_path))
        else:
            errors.append(f"File '{file.filename}' not allowed or failed to save.")

    if not saved_files:
         return jsonify({"error": "No valid files were uploaded.", "details": errors}), 400

    return jsonify({
        "message": "Bulk photos uploaded successfully",
        "uploaded_files": saved_files,
        "errors": errors
    }), 201