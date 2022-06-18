import httpx
import sqlalchemy
from sqlalchemy.orm import Session
from db.schema import AvailableData, engine
from typing import List

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from utils.helper_functions import load_from_json


def get_availabilty() -> List[dict]:
    '''This function returns a list of dictionarys with the month as a key and 
    list of police forces that proided stop and search data as the value.'''
    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url)
    return r.json()

def get_available_datasets() -> List[dict]:
    '''This function returns a list of tuples with police force and month where data 
    is available.'''

    available_data = []
    police_forces = load_from_json(ROOT_DIR+'police_dashboard/data/police_forces.json')
    available_dates = get_availabilty()

    for i in available_dates:
        for force_id in police_forces.keys():
            if force_id in i.get('stop-and-search'):
                available_data.append({'force_id': force_id, 'month': i.get('date')})
                
    return available_data

def save_available_data_db() -> None:
    response = get_available_datasets()
    with Session(engine) as session:
        for available_data_record in response:
            record = AvailableData(**available_data_record)
            print(f"Adding {available_data_record['force_id']} police force for {available_data_record['month']} to database...")
            session.add(record)
        print('Adding all records...')
        session.commit()
    
    
if __name__ == '__main__':
    try:
        save_available_data_db()
    except sqlalchemy.exc.IntegrityError:
        print('Error')