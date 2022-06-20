import httpx

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR, ROOT_DIR+'/police_dashboard'] + sys.path

from utils.helper_functions import save_as_json

def get_police_forces() -> dict:
    url = 'https://data.police.uk/api/forces'
    r = httpx.get(url)
    police_forces = {force['id']: force['name'] for force in r.json()}
    return police_forces

    
if __name__ == '__main__':
    police_forces = get_police_forces()
    save_as_json(police_forces, ROOT_DIR+'/police_dashboard/data/police_forces.json')