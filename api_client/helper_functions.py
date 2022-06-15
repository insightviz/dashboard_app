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

REPLACE_DICT = {'Other ethnic group - Not stated': 'Other',
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

HEADERS = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'}

async def clean_data(available_dataset, force):
    
    list = []

    for item in available_dataset:

        item['police_force'] = force
        del item['outcome_object']
        item['latitude'] = get_dictionary_value(item, ['location', 'latitude'])
        item['longitude'] = get_dictionary_value(item, ['location', 'longitude'])
        item['street_id'] = get_dictionary_value(item, ['location', 'street', 'id'])
        item['street_desc'] = get_dictionary_value(item, ['location', 'street', 'name'])
        del item['location']

        if item.get('self_defined_ethnicity') in REPLACE_DICT.keys():
            item['person_ethnicity'] = REPLACE_DICT[item['self_defined_ethnicity']]

        list.append(item)
    return list