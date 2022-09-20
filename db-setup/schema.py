from .config import Base, engine 
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean

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
    date = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    street_id = Column(Integer)
    street_desc = Column(String)
    person_ethnicity = Column(String)

class User(Base):
    __tablename__ = 'users_registered'

    id = Column(Integer, primary_key = True)
    firstName = Column(String, nullable = True)
    email = Column(String, nullable = False, unique=True)

Base.metadata.create_all(engine) # This creates all tables above. By default CREATES are not issued for already existing tables.