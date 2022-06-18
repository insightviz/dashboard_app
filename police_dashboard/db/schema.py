import os
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, create_engine


DB_CONFIG = {
    'db': os.getenv('DB_NAME', 'police_dashboard'),
    'user': os.getenv('USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
}

CONNECTION_STRING = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}/{DB_CONFIG['db']}"
# connect with data
engine = create_engine(url=CONNECTION_STRING, echo=True)
# manage tables
Base = declarative_base()


class StopSearchRecords(Base): 
    __tablename__ = "stop_search_records"

    id = Column(Integer, primary_key=True)
    age_range = Column(String)
    outcome = Column(String)
    involved_person = Column(Boolean)
    self_defined_ethnicity = Column(String)
    gender = Column(String)
    legislation = Column(String)
    outcome_linked_to_object_of_search = Column(Boolean)
    datetime = Column(DateTime)
    removal_of_more_than_outer_clothing = Column(Boolean)
    operation = Column(Boolean)
    officer_defined_ethnicity = Column(String)
    type = Column(String)
    operation_name = Column(String)
    object_of_search = Column(String)
    force_id = Column(String)
    month = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    street_id = Column(Integer)
    street_desc = Column(String)
    person_ethnicity = Column(String)


class AvailableData(Base):
    __tablename__ = "available_data"

    id = Column(Integer, primary_key=True)
    force_id = Column(String)
    month = Column(String)


Base.metadata.create_all(engine) # This creates all tables above. By default CREATES are not issued for already existing tables.
