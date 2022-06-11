import httpx
import asyncio

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'}

# get force data

def get_forces():
    url = 'https://data.police.uk/api/forces'
    r = httpx.get(url, headers=headers)
    return r.json()


# get availability data with dates 
def get_availabilty():
    '''This function returns a list of dictionarys with the month as a key and 
    list of police forces that proided stop and search data as the value.'''

    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url, headers=headers)
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

def get_dictionary_value(dictionary, keys):
    '''
    Gets value from nested dictionary.

    Parameters
    ----------
    dictionary: dict
        Dictionary to search in.
    keys: list
        Keys to search the dictionary with. 

    Returns
    -------
    dictionary: int or str or bool or dict or none
        int or str or bool if bottom-level of dictionary 
        dict if not bottom-level of dictionary
        none value if KeyError is raised
    '''

    for key in keys:  
        try:
            dictionary = dictionary[key]

        except KeyError:
            dictionary = None
            break

        except TypeError:
            dictionary = None
            break      

    return dictionary    


async def get_requests(client:httpx.AsyncClient, parameters:dict, force):
    '''This function sends requests to police-api for stop and search data. 
    Input is a list of tuples with arguments, month and police force.''' 
    
    url = 'https://data.police.uk/api/stops-force'
    r = await client.get(url, headers=headers, params=parameters)

    result = await clean_data(r.json(), force)
    return result

#%%
#
# perform cleaning 

async def clean_data(iterable, force):
    replace_dict = {'Other ethnic group - Not stated': 'Other',
         'Black/African/Caribbean/Black British - Any other Black/African/Caribbean background': 'Black',
         'Black/African/Caribbean/Black British - African': 'Black',
         'White - Any other White background': 'White',
         'Other ethnic group - Any other ethnic group': 'Other',
         'Black/African/Caribbean/Black British - Caribbean': 'Black',
         'Asian/Asian British - Pakistani': 'Asian',
         'White - English/Welsh/Scottish/Northern Irish/British': 'White',
         'Asian/Asian British - Any other Asian background': 'Asian',
         'Asian/Asian British - Bangladeshi': 'Asian',
         'Mixed/Multiple ethnic groups - Any other Mixed/Multiple ethnic background': 'Mixed',
         'Mixed/Multiple ethnic groups - White and Asian': 'Mixed',
         'Asian/Asian British - Indian': 'Asian',
         'Mixed/Multiple ethnic groups - White and Black African': 'Mixed',
         'Mixed/Multiple ethnic groups - White and Black Caribbean': 'Mixed',
         'White - Irish': 'White', 'Asian/Asian British - Chinese': 'Asian'}
    list = []

    for item in iterable:

        item['police_force'] = force
        del item['outcome_object']
        item['latitude'] = get_dictionary_value(item, ['location', 'latitude'])
        item['longitude'] = get_dictionary_value(item, ['location', 'longitude'])
        item['street_id'] = get_dictionary_value(item, ['location', 'street', 'id'])
        item['street_desc'] = get_dictionary_value(item, ['location', 'street', 'name'])
        del item['location']

        if item.get('self_defined_ethnicity') in replace_dict.keys():
            item['person_ethnicity'] = replace_dict[item['self_defined_ethnicity']]

        list.append(item)
    return list

data = asyncio.run(request_available_datasets())
print(data)
print(len(data))
# save to database