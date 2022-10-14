import os
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
import json

# gets database credentials from environment variable in aws cloud instance
CREDENTIALS = json.loads(os.environ.get('insight_db_credentials'))

CONNECTION_STRING = f"postgresql://{CREDENTIALS['username']}:{CREDENTIALS['password']}@{CREDENTIALS['host']}/{CREDENTIALS['database']}"
# connect with data
engine = create_engine(url=CONNECTION_STRING, echo=True)
# manage tables
Base = declarative_base()