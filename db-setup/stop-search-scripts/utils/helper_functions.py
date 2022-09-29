import json
import re

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

async def clean_data(available_dataset, parameters:dict):
    
    list = []

    for item in available_dataset:

        item['force_id'] = parameters['force']
        item['date'] = parameters['date']
        item['date_corrected'] = re.match('\d{4}-\d{2}', get_dictionary_value(item, ['datetime']))[0] + '-01'
        del item['outcome_object']
        item['latitude'] = get_dictionary_value(item, ['location', 'latitude'])
        item['longitude'] = get_dictionary_value(item, ['location', 'longitude'])
        item['street_id'] = get_dictionary_value(item, ['location', 'street', 'id'])
        item['street_desc'] = get_dictionary_value(item, ['location', 'street', 'name'])
        del item['location']

        if 'black' in str(item.get('self_defined_ethnicity')).lower():
            item['person_ethnicity'] = 'Black'
        elif 'white' in str(item.get('self_defined_ethnicity')).lower():
            item['person_ethnicity'] = 'White'
        elif 'asian' in str(item.get('self_defined_ethnicity')).lower():
            item['person_ethnicity'] = 'Asian'
        elif 'mixed' in str(item.get('self_defined_ethnicity')).lower():
            item['person_ethnicity'] = 'Mixed'
        elif 'other' in str(item.get('self_defined_ethnicity')).lower():
            item['person_ethnicity'] = 'Other'
        else:
            item['person_ethnicity'] = item['self_defined_ethnicity']

        list.append(item)
    return list

def save_as_json(obj: dict, filepath: str) -> None:
    with open(filepath, 'w') as fp:
        json.dump(obj, fp)

def load_from_json(filepath: str) -> dict:
    with open(filepath) as json_file:
        data = json.load(json_file)
        return data