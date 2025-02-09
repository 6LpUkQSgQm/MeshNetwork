import os


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret-key")


class DevelopmentConfig(Config):
    FLASK_ENV = "development"
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DEV_DATABASE_URI", "sqlite:///local_dev.db")
    CORS_ALLOWED_ORIGINS = "https://192.168.68.50:3000"


class ProductionConfig(Config):
    FLASK_ENV = "production"
    DEBUG = True
    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "https://raspberrypi.local:3000")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "PROD_DATABASE_URI", "postgresql://postgres:password@db:5432/mydb"
        
    )
