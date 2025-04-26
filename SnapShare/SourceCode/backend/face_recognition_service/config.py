import os

# Get the absolute path of the directory where this config file is located
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Go one level up to the project root (face-recognition-api) relative to src/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

class Config:
    """Base configuration."""
    SERVICE_SECRET_KEY = os.getenv('SERVICE_SECRET_KEY')
    CONTAINER_NAME_STORAGE = os.getenv('CONTAINER_NAME_STORAGE')
    ACCOUNT_NAME_STORAGE = os.getenv('ACCOUNT_NAME_STORAGE')
    ACCOUNT_KEY_STORAGE = os.getenv('ACCOUNT_KEY_STORAGE')
    DEBUG = False
    TESTING = False

    # Allowed file extensions for uploads
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

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