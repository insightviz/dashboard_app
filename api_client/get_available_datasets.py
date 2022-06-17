import httpx
from helper_functions import  HEADERS
import time
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from database_tables import AvailableData, create_tables, engine
from get_force_data import get_forces


# get availability data with dates 
def get_availabilty():
    '''This function returns a list of dictionarys with the month as a key and 
    list of police forces that proided stop and search data as the value.'''

    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url, headers=HEADERS)
    return r.json()


# use two pieces for query for stop and search data
def get_available_datasets():
    '''This function returns a list of tuples with police and month where data 
    is available.'''

    available_data = []
    police_forces = get_forces()
    available_dates = get_availabilty()

    for i in available_dates:
        for f in police_forces:
            if f.get('id') in i.get('stop-and-search'):
                # (force id, month)
                available_data.append({'force_id': f.get('id'), 'month': i.get('date')})
    
    return available_data

# save to database
def save_available_data_db():
    id=1
    response = get_available_datasets()
    Session = sessionmaker(bind=engine)
    session = Session()
    for dictionary in response:
        dictionary['id']=id
        id+=1
        record = AvailableData(*tuple(dictionary.values()))
        print(f"Adding {dictionary['force_id']} police force for {dictionary['month']} to database...")
        session.add(record)
    print('Adding all records...')
    session.commit()
    
    
if __name__ == '__main__':
    create_tables()
    s = time.time()
    try:
        save_available_data_db()
    except sqlalchemy.exc.IntegrityError:
        print('Duplicate value in primary key')
    e = time.time()
    print(e-s)