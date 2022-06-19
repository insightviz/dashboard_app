import httpx
import asyncio
import time
from sqlalchemy.orm import Session

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from db.schema import StopSearchRecords, engine
from scripts.get_available_datasets import get_available_datasets
from utils.helper_functions import clean_data


async def request_available_datasets(available_datasets: list[dict]) -> list[list[dict]]:
    total = len(available_datasets)

    async with httpx.AsyncClient(timeout=None, event_hooks={'request': [log_request], 'response': [log_response]}) as client:
        tasks = []
        counter = 1
        progress = 0
        print(progress/total)
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
                await asyncio.sleep(.4)

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
    if response.status_code in [429, 502, 504]:
        #delay time from experimenting
        await asyncio.sleep(3)
        await get_requests(client, parameters)

    elif response.status_code == 500:
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
    available_datasets = get_available_datasets()
    data = asyncio.run(request_available_datasets(available_datasets))
    save_stop_search_data_db(data)
    end = time.time()
    print(f"Time-take to run script: {end-start}")