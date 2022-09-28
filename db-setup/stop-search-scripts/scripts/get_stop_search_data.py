import httpx
import asyncio
import time
from sqlalchemy.orm import Session
from sqlalchemy import select

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path = [ROOT_DIR] + sys.path

from schema import StopSearchRecords, engine
from get_available_datasets import get_available_datasets
from utils.helper_functions import clean_data

def check_datasets_saved() -> set:
    with Session(engine) as session:
        statement = select(StopSearchRecords.force_id, StopSearchRecords.date).distinct()
        result = session.execute(statement).all()
        result = [(row[0], str(row[1])[:-3]) for row in result]
        return set(result)


def check_datasets_not_in_db() -> list[dict]:
    available_datasets = get_available_datasets()
    saved_datasets = check_datasets_saved()
    new_datasets = []
    for dataset in available_datasets:
        if tuple(dataset.values()) not in saved_datasets:
            new_datasets.append(dataset)
    return new_datasets

async def request_available_datasets(available_datasets: list[dict]) -> list[list[dict]]:
    total = len(available_datasets)

    async with httpx.AsyncClient(timeout=None, event_hooks={'request': [log_request], 'response': [log_response]}) as client:
        tasks = []
        counter = 1
        progress = 0
        for parameters in available_datasets:
            if counter%30==0:
                #delay time from exprimenting
                await asyncio.sleep(3)
                task = asyncio.create_task(get_requests(client, parameters))
                tasks.append(task)
                counter+=1
                print(f'{progress/total*100}%')
                progress+=1

            else:
                task = asyncio.create_task(get_requests(client, parameters))
                tasks.append(task)
                counter+=1
                # these progress bars aren't that useful at the moment. Majority of wait happens after 'progress' gets to 100%. 
                # Cause they just track the adding of a task to the tasks list not the returning of responses from the API. 
                # The httpx library has some native support for progress bars, though. Perhaps worth looking into.
                progress+=1
                print(f'{progress/total*100}%') 
                #pause before next request from experimenting
                await asyncio.sleep(.5)

        response = await asyncio.gather(*tasks)
    return response

async def log_request(request: httpx.Request) -> None:
    print(f"Request event hook: {request.method} {request.url} - Waiting for response")
    

async def log_response(response: httpx.Response) -> None:
    request = response.request
    print(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")

async def get_requests(client:httpx.AsyncClient, parameters:dict):
    '''This function sends requests to police-api for stop and search data. 
    Input is a list of tuples with arguments, month and police force.''' 
    
    url = 'https://data.police.uk/api/stops-force'
    response = await client.get(url, params=parameters)
    if response.status_code == 429:
        #delay time from experimenting
        await asyncio.sleep(3)
        await get_requests(client, parameters)

    elif response.status_code in [500, 502, 504]:
        if response.status_code == 500:
            global restart 
            restart = True
        pass

    elif response.status_code == 200:
        result = await clean_data(response.json(), parameters)
        return result

    else:
        response.raise_for_status()
        
def save_stop_search_data_db(data: list[list[dict]]) -> None:
    with Session(engine) as session:
        for response in data:
            if response == None or response == []:
                pass
            else:
                for stop_and_search_record in response:
                    record = StopSearchRecords(**stop_and_search_record)
                    session.add(record)
                session.commit()

    
if __name__ == '__main__':
    start = time.time()
    restart = True
    while restart:
        for i in range(100):
            # Default: execute once
            restart = False
            new_datasets = check_datasets_not_in_db()
            data = asyncio.run(request_available_datasets(new_datasets))
            save_stop_search_data_db(data)
            if ~restart:
                break
    end = time.time()
    print(f"Time-take to run script: {end-start}")