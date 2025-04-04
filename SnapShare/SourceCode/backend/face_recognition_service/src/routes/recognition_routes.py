from flask import Blueprint, request, jsonify, current_app
#from services.recognition_service import run_face_recognition    chat staff

recognition_bp = Blueprint('recognition_bp', __name__, url_prefix='/recognize')

@recognition_bp.route('/', methods=['POST'])
def trigger_recognition():
    """
    Triggers the face recognition process on uploaded profiles and bulk photos.
    Accepts optional 'tolerance' and 'std_factor' in JSON body.
    """
    data = request.get_json() or {}
    tolerance = data.get('tolerance') # Can be None
    std_factor = data.get('std_factor') # Can be None

    # Convert to float if provided, otherwise None will use defaults in service
    try:
        if tolerance is not None:
            tolerance = float(tolerance)
        if std_factor is not None:
            std_factor = float(std_factor)
    except ValueError:
        return jsonify({"error": "Invalid number format for tolerance or std_factor"}), 400


    results, status_code = run_face_recognition(tolerance=tolerance, std_factor=std_factor)

    return jsonify(results), status_code