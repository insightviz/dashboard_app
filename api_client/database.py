import psycopg2 as pc
from db_config import DB_CONFIG
from sqlalchemy.orm import declarative_base, relationship
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
    force_id = Column(String, ForeignKey("police_forces.force_id"))
    latitude = Column(Float)
    longitude = Column(Float)
    street_id = Column(Integer)
    street_desc = Column(String)
    person_ethnicity = Column(String)
    id = Column(Integer, primary_key=True)


    def __init__(self, age_range, outcome, involved_person, self_defined_ethnicity,
                 gender, legislation, outcome_linked_to_object_of_search,
                 datetime, removal_of_more_than_outer_clothing, operation,
                 officer_defined_ethnicity, type, operation_name, object_of_search,
                 force_id, latitude, longitude, street_id, street_desc,
                 person_ethnicity, id):
        
        self.age_range = age_range
        self.outcome = outcome
        self.involved_person = involved_person
        self.self_defined_ethnicity = self_defined_ethnicity
        self.gender = gender
        self.legislation = legislation
        self.outcome_linked_to_object_of_search = outcome_linked_to_object_of_search
        self.datetime = datetime
        self.removal_of_more_than_outer_clothing = removal_of_more_than_outer_clothing
        self.operation = operation
        self.officer_defined_ethnicity = officer_defined_ethnicity
        self.type = type
        self.operation_name = operation_name
        self.object_of_search = object_of_search
        self.force_id = force_id
        self.latitude = latitude
        self.longitude = longitude
        self.street_id = street_id
        self.street_desc = street_desc
        self.person_ethnicity = person_ethnicity
        self.id = id

class PoliceForces(Base):
    __tablename__ = "police_forces"
    force_id = Column(String, primary_key=True)
    force_name = Column(String)

    def __init__(self, force_id, force_name):
        self.force_id = force_id
        self.force_name = force_name

#Base.metadata.create_all(engine)

class CreateTables:
    
    def __init__(self):
        self.create_tables()

    def create_tables(self):
        '''
        Create tables in database.  
        '''

        print("Creating database tables...")
        Base.metadata.create_all(engine)
        print("Tables created!")
