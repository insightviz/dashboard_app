import httpx
import asyncio
from helper_functions import clean_data, HEADERS


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
    
    return available_data


async def request_available_datasets():
    available_datasets = get_available_datasets()[:10]

    async with httpx.AsyncClient() as client:
        tasks = []
        for i in available_datasets:
            parameters = {'force': i['force_id'], 'date': i['month']}
            force = i['force_name']
            task = asyncio.create_task(get_requests(client, parameters, force))
            tasks.append(task)

        data = await asyncio.gather(*tasks)
        return data



async def get_requests(client:httpx.AsyncClient, parameters:dict, force):
    '''This function sends requests to police-api for stop and search data. 
    Input is a list of tuples with arguments, month and police force.''' 
    
    url = 'https://data.police.uk/api/stops-force'
    r = await client.get(url, headers=HEADERS, params=parameters)

    result = await clean_data(r.json(), force)
    return result

data = asyncio.run(request_available_datasets())
print(data)
print(len(data))

# save to database