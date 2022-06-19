from flask import Flask
from sqlalchemy.orm import Session

import os
import sys
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path = [ROOT_DIR] + sys.path

from db.schema import AvailableData, engine
app = Flask(__name__)


@app.route("/available_forces/<month>", methods=['GET'])
def get_all_available_data(month):
    all_forces_in_month = { month: [] }
    with Session(engine) as session:
        results = session.query(AvailableData).filter_by(month=month).all()
        for row in results:
            all_forces_in_month[month].append(row.force_id)
    return all_forces_in_month
            


if __name__ == '__main__':
    app.run(debug=True)



