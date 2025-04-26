from flask import Flask, jsonify, request
import os

from config import get_config
from routes.profile_routes import profile_bp
from routes.recognition_routes import recognition_bp


def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Load configuration
    config = get_config()
    app.config.from_object(config)
    # Load instance config if it exists (e.g., instance/config.py)
    app.config.from_pyfile('config.py', silent=True)

    # Ensure instance folder exists (if needed later)
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass # Handle error appropriately

    # --- Secret Key Validation in Requests ---
    @app.before_request
    def check_secret_key_in_request():
        service_secret_key = request.headers.get('SERVICE-SECRET-KEY')  # Retrieve secret key from request header (custom header)
        # Validate if the request has the correct SECRET_KEY
        if not service_secret_key or service_secret_key != app.config.get('SERVICE_SECRET_KEY'):
            return jsonify({"error": "Invalid or missing SERVICE-SECRET-KEY"}), 403  # Forbidden if invalid key

    # --- Register Blueprints ---
    app.register_blueprint(profile_bp)
    app.register_blueprint(recognition_bp)

    # --- Simple Welcome Route ---
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Face Recognition API!"})

    # --- Optional: Add Global Error Handlers ---
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not Found", "message": str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
         # Log the error details here
        app.logger.error(f"Server Error: {error}", exc_info=True)
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad Request", "message": str(error)}), 400


    return app

# --- Application Entry Point ---
# Allows running with 'python -m src.app' or using a WSGI server like gunicorn

# Create app instance for potential use by WSGI servers
app = create_app()

if __name__ == '__main__':
    # Run in debug mode if executed directly (for development)
    # Use environment variable PORT or default to 5000
    port = int(os.environ.get('PORT', 5001)) # Use 5001 to avoid conflict with default 5000
    app.run(host='0.0.0.0', port=port)