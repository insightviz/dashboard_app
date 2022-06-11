import httpx

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'}

# get force data

def get_forces():
    url = 'https://data.police.uk/api/forces'
    r = httpx.get(url, headers=headers, timeout=None)
    return r.json()


# get availability data with dates 
def get_availabilty():
    url = 'https://data.police.uk/api/crimes-street-dates'
    r = httpx.get(url, headers=headers, timeout=None)
    return r.json()

# use two pieces for query for stop and search data
def get_available_datasets():
    available_data = []
    police_forces = get_forces()
    available_dates = get_availabilty()

    for i in available_dates:
        for f in police_forces:
            if f.get('id') in i.get('stop-and-search'):
                #print(f"For {i.get('date')}, {f.get('id')} provided data")
                available_data.append((f.get('id'), i.get('date'), f.get('name')))
    
    return available_data


# def request_available_datasets(list_of_parameters):       




#f'https://data.police.uk/api/stops-force?force={avon-and-somerset}&date={2017-01}'
# perform cleaning 
# save to database