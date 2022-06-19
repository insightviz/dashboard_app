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
    response = {}
    with Session(engine) as session:
        results = session.query(AvailableData).filter_by(month=month).all()
        if len(results) > 0:
            forces = []
            for row in results:
                forces.append(row.force_id)
                response[month] = forces
        else:
            response['message'] = 'No police force data available for this month'
    return response
            


if __name__ == '__main__':
    app.run(debug=True)



