import httpx
import asyncio
from helper_functions import clean_data, HEADERS
import time

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
                available_data.append({'force_id': f.get('id'), 'month': i.get('date'), 
                'force_name': f.get('name')})
    
    return available_data[:200] # remove indexing


async def request_available_datasets():
    available_datasets = get_available_datasets()

    async with httpx.AsyncClient(timeout=None, event_hooks={'request': [log_request], 'response': [log_response]}) as client:
        tasks = []
        for i in available_datasets:
            parameters = {'force': i['force_id'], 'date': i['month']}
            force = i['force_name']
            task = asyncio.create_task(get_requests(client, parameters, force))
            tasks.append(task)
            #pause before next request
            await asyncio.sleep(.3)

        response = await asyncio.gather(*tasks)
    return response

async def log_request(request):
    print(f"Request event hook: {request.method} {request.url} - Waiting for response")
    

async def log_response(response):
    request = response.request
    print(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")

async def get_requests(client:httpx.AsyncClient, parameters:dict, force):
    '''This function sends requests to police-api for stop and search data. 
    Input is a list of tuples with arguments, month and police force.''' 
    
    url = 'https://data.police.uk/api/stops-force'
    response = await client.get(url, headers=HEADERS, params=parameters)
    if response.status_code == 429 or response.status_code == 500:
        await asyncio.sleep(2)
        await get_requests(client, parameters, force)

    elif response.status_code == 200:
        result = await clean_data(response.json(), force)

    else:
        response.raise_for_status()
        
        return result

s = time.time()
data = asyncio.run(request_available_datasets())
e = time.time()
#print(data)
print(len(data))
print(e-s)

# save to database