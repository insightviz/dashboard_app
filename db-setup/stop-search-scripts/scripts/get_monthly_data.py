import time
import asyncio
from sqlalchemy.orm import Session
from sqlalchemy import select

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path = [ROOT_DIR] + sys.path

from schema import StopSearchRecords, engine
from get_stop_search_data import save_stop_search_data_db, request_available_datasets
from get_available_datasets import get_available_datasets


def check_datasets_saved() -> set:
    with Session(engine) as session:
        statement = select(StopSearchRecords.force_id, StopSearchRecords.date).distinct()
        result = session.execute(statement).all()
        return set(result)


def check_datasets_not_in_db() -> list[dict]:
    available_datasets = get_available_datasets()
    saved_datasets = check_datasets_saved()
    new_datasets = []
    for dataset in available_datasets:
        if tuple(dataset.values()) not in saved_datasets:
            new_datasets.append(dataset)
    return new_datasets


if __name__ == '__main__':
    start = time.time()
    new_datasets = check_datasets_not_in_db()
    data = asyncio.run(request_available_datasets(new_datasets))
    save_stop_search_data_db(data)
    end = time.time()
    print(f"Time-take to run script: {end-start}")