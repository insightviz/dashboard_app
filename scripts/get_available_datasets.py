import httpx
import time
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from db.schema import AvailableData, engine
from get_force_data import get_forces

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from utils.helper_functions import load_from_json


# get availability data with dates 
def get_availabilty():
    '''This function returns a list of dictionarys with the month as a key and 
    list of police forces that proided stop and search data as the value.'''
    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url)
    return r.json()


# use two pieces for query for stop and search data
def get_available_datasets():
    '''This function returns a list of tuples with police and month where data 
    is available.'''

    available_data = []
    police_forces = load_from_json()
    available_dates = get_availabilty()

    for i in available_dates:
        for force_id in police_forces.keys():
            if force_id in i.get('stop-and-search'):
                # (force id, month)
                available_data.append({'force_id': force_id, 'month': i.get('date')})
    
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
        record = AvailableData(**dictionary)
        print(f"Adding {dictionary['force_id']} police force for {dictionary['month']} to database...")
        session.add(record)
    print('Adding all records...')
    session.commit()
    
    
if __name__ == '__main__':
    s = time.time()
    try:
        save_available_data_db()
    except sqlalchemy.exc.IntegrityError:
        print('Error')
    e = time.time()
    print(e-s)