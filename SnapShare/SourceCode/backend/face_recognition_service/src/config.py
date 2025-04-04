import os

# Get the absolute path of the directory where this config file is located
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Go one level up to the project root (face-recognition-api) relative to src/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_secret_key') # Change this!
    DEBUG = False
    TESTING = False

    # Define upload folder relative to the project root
    UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'uploads')
    PROFILE_UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, 'profiles')
    BULK_UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, 'bulk')

    # Allowed file extensions for uploads
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    # Face Recognition Defaults
    DEFAULT_RECOGNITION_TOLERANCE = 0.5
    DEFAULT_RECOGNITION_STD_FACTOR = 0.5

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Add production-specific settings like database URI, etc.

# Select the configuration based on an environment variable (e.g., FLASK_ENV)
# Default to DevelopmentConfig if not specified
config_by_name = dict(
    development=DevelopmentConfig,
    production=ProductionConfig,
    default=DevelopmentConfig
)

# Function to get configuration object
def get_config():
    env = os.getenv('FLASK_ENV', 'default')
    return config_by_name.get(env, DevelopmentConfig)

# --- Create Upload Directories ---
# Ensure upload directories exist when the config is loaded
# Note: This runs when the module is imported
current_config = get_config()
os.makedirs(current_config.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(current_config.PROFILE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(current_config.BULK_UPLOAD_FOLDER, exist_ok=True)