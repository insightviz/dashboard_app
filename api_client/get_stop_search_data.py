import httpx
import asyncio
from helper_functions import clean_data, HEADERS
import time
from sqlalchemy.orm import sessionmaker
from database_tables import StopSearchRecords, create_tables, engine

# get force data
def get_forces():
    url = 'https://data.police.uk/api/forces'
    r = httpx.get(url, headers=HEADERS)
    return r.json()


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
                # (force id, month, full force name)
                available_data.append({'force_id': f.get('id'), 'month': i.get('date')})
    
    return available_data[:5] # remove indexing


async def request_available_datasets():
    available_datasets = get_available_datasets()

    async with httpx.AsyncClient(timeout=None, event_hooks={'request': [log_request], 'response': [log_response]}) as client:
        tasks = []
        counter = 1
        for i in available_datasets:
            parameters = {'force': i['force_id'], 'date': i['month']}
            if counter%30==0:
                #delay time from exprimenting
                await asyncio.sleep(3)
                task = asyncio.create_task(get_requests(client, parameters))
                tasks.append(task)
                counter+=1

            else:
                task = asyncio.create_task(get_requests(client, parameters))
                tasks.append(task)
                counter+=1
                #pause before next request from experimenting
                await asyncio.sleep(.05)

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
    if (response.status_code == 429) or (response.status_code == 500) or (response.status_code == 502) :
        #delay time from exprimenting
        await asyncio.sleep(3)
        await get_requests(client, parameters)

    elif response.status_code == 200:
        result = await clean_data(response.json(), parameters)
        return result

    else:
        response.raise_for_status()
        

# save to database
def save_stop_search_data_db():
    id=1

    data = asyncio.run(request_available_datasets())
    Session = sessionmaker(bind=engine)
    session = Session()
    for response in data:
        for dictionary in response:
            dictionary['id']=id
            id+=1
            record = StopSearchRecords(*tuple(dictionary.values()))
            print(f"Adding record {id} to database... {dictionary['police_force']}:{dictionary['datetime']}")
            session.add(record)
    print('Commiting all records...')
    session.commit()

    
if __name__ == '__main__':
    create_tables()
    s = time.time()
    save_stop_search_data_db()
    e = time.time()
    print(e-s)