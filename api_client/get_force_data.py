import httpx
from helper_functions import HEADERS
import time
from sqlalchemy.orm import sessionmaker
import sqlalchemy
from database_tables import PoliceForces, create_tables, engine


# get force data
def get_forces():
    url = 'https://data.police.uk/api/forces'
    r = httpx.get(url, headers=HEADERS)
    return r.json()


# save to database
def save_forces_data_db():
    response = get_forces()
    Session = sessionmaker(bind=engine)
    session = Session()
    for dictionary in response:
        record = PoliceForces(*tuple(dictionary.values()))
        print(f"Adding {dictionary['id']} police force to database...")
        session.add(record)
    print('Adding all records...')
    session.commit()

    
if __name__ == '__main__':
    create_tables()
    s = time.time()
    try:
        save_forces_data_db()
    except sqlalchemy.exc.IntegrityError:
        print('Duplicate value in primary key force_id')
    e = time.time()
    print(e-s)