import os
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine


DB_CONFIG = {
    'database': os.getenv('DB_NAME', 'police_dashboard'),
    'user': os.getenv('USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
}

CONNECTION_STRING = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}/{DB_CONFIG['database']}"
# connect with data
engine = create_engine(url=CONNECTION_STRING, echo=True)
# manage tables
Base = declarative_base()