import httpx
import asyncio
import time
from sqlalchemy.orm import Session
from sqlalchemy import select

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from db.schema import AvailableData, StopSearchRecords, engine
from utils.helper_functions import clean_data, HEADERS


def check_available_datasets():
    with Session(engine) as session:
        statement = select(AvailableData.force_id, AvailableData.month)
        result = session.execute(statement).all()
        return result

async def request_available_datasets():
    available_datasets = check_available_datasets()
    total = len(available_datasets)

    async with httpx.AsyncClient(timeout=None, event_hooks={'request': [log_request], 'response': [log_response]}) as client:
        tasks = []
        counter = 1
        progress = 0
        print(progress/total)
        for i in available_datasets:
            parameters = {'force': i[0], 'month': i[1]}
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
                print(f'{progress/total*100}%')
                progress+=1
                #pause before next request from experimenting
                await asyncio.sleep(.4)

        response = await asyncio.gather(*tasks)
    return response

async def log_request(request):
    print(f"Request event hook: {request.method} {request.url} - Waiting for response")
    

async def log_response(response):
    request = response.request
    print(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")

async def get_requests(client:httpx.AsyncClient, parameters:dict):
    '''This function sends requests to police-api for stop and search data. 
    Input is a list of tuples with arguments, month and police force.''' 
    
    url = 'https://data.police.uk/api/stops-force'
    response = await client.get(url, headers=HEADERS, params=parameters)
    if response.status_code in [429, 500, 502, 504]:
        #delay time from exprimenting
        await asyncio.sleep(3)
        await get_requests(client, parameters)

    elif response.status_code == 200:
        result = await clean_data(response.json(), parameters)
        return result

    else:
        response.raise_for_status()
        
def save_stop_search_data_db():
    data = asyncio.run(request_available_datasets())
    with Session(engine) as session:
        for response in data:
            if response == None:
                pass
            else:
                for stop_and_search_record in response:
                    record = StopSearchRecords(**stop_and_search_record)
                    session.add(record)
                session.commit()

    
if __name__ == '__main__':
    start = time.time()
    save_stop_search_data_db()
    end = time.time()
    print(f"Time-take to run script: {end-start}")