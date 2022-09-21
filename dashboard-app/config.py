import os

DB_CONFIG = {
    'database': os.environ.get('POSTGRES_DB'),
    'user': os.environ.get('POSTGRES_USER'),
    'password': os.environ.get('POSTGRES_PASSWORD'),
    'host': os.environ.get('POSTGRES_HOST'),
}

CONNECTION_STRING = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}/{DB_CONFIG['database']}"

class Config(object):
    SQLALCHEMY_DATABASE_URI = CONNECTION_STRING
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    SECRET_KEY = "pro"

class DevelopmentConfig(Config):
    SECRET_KEY="dev"
