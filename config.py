import os

class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    SECRET_KEY = "pro"

class DevelopmentConfig(Config):
    SECRET_KEY="dev"
    DEBUG = True

class TestingConfig(Config):
    TESTING = True