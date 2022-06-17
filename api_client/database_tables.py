from db_config import DB_CONFIG
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, create_engine


CONNECTION_STRING = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}/{DB_CONFIG['database']}"
# connect with data
engine = create_engine(url=CONNECTION_STRING, echo=True)
# manage tables
Base = declarative_base()

class StopSearchRecords(Base): 
    __tablename__ = "stop_search_records"
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
    force_id = Column(String, ForeignKey("police_forces.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    street_id = Column(Integer)
    street_desc = Column(String)
    person_ethnicity = Column(String)
    id = Column(Integer, primary_key=True)


class PoliceForces(Base):
    __tablename__ = "police_forces"
    id = Column(String, primary_key=True)
    name = Column(String)


#Base.metadata.create_all(engine)

class AvailableData(Base):
    __tablename__ = "available_data"
    force_id = Column(String, ForeignKey("police_forces.id"))
    month = Column(String)
    id = Column(String, primary_key=True)


def create_tables():
    '''
    Create tables in database.  
    '''

    print("Creating database tables...")
    Base.metadata.create_all(engine)
    print("Tables created!")
