import os
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_file(file, upload_folder, subfolder=None):
    """Saves an uploaded file securely."""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        target_folder = upload_folder
        if subfolder:
            target_folder = os.path.join(upload_folder, subfolder)
            os.makedirs(target_folder, exist_ok=True) # Ensure subfolder exists

        file_path = os.path.join(target_folder, filename)
        file.save(file_path)
        return file_path # Return the path where the file was saved
    return None