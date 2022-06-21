import httpx
import time
import asyncio
from sqlalchemy.orm import Session
from sqlalchemy import select

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from db.schema import StopSearchRecords, engine
from scripts.get_stop_search_data import save_stop_search_data_db, request_available_datasets
from utils.helper_functions import load_from_json


def get_availabilty() -> list[dict]:
    '''This function returns a list of dictionaries with the month as a key and 
    list of police forces that proided stop and search data as the value.'''
    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url)
    return r.json()


def get_available_datasets() -> list[dict]:
    '''This function returns a list of dictionaries with police force and month where data 
    is available.'''
    available_data = []
    police_forces = load_from_json(ROOT_DIR+'/police_dashboard/data/police_forces.json')
    available_dates = get_availabilty()

    for i in available_dates:
        for force_id in police_forces.keys():
            if force_id in i.get('stop-and-search'):
                available_data.append({'force': force_id, 'month': i.get('date')})
    return available_data


def check_datasets_saved() -> set:
    with Session(engine) as session:
        statement = select(StopSearchRecords.force_id, StopSearchRecords.month).distinct()
        result = session.execute(statement).all()
        return set(result)


def check_datasets_not_in_db() -> list[dict]:
    available_datasets = get_available_datasets()
    saved_datasets = check_datasets_saved()
    new_datasets = []
    for dataset in available_datasets:
        if tuple(dataset.values()) not in saved_datasets:
            new_datasets.append(dataset)
    return new_datasets


if __name__ == '__main__':
    start = time.time()
    new_datasets = check_datasets_not_in_db()
    data = asyncio.run(request_available_datasets(new_datasets))
    save_stop_search_data_db(data)
    end = time.time()
    print(f"Time-take to run script: {end-start}")