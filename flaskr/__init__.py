import os
from sqlalchemy.orm import Session
from flask import Flask, render_template
from dashboards.stop_search_dashboard.db.schema import StopSearchRecords, engine
from sqlalchemy import func


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    print(app.instance_path)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/contact')
    def contact():
        return render_template('contact.html')

    @app.route('/stopsearch')
    def stopsearch():
        with Session(engine) as session:
            x, y = [], []
            results = session.query(StopSearchRecords.month, func.count(StopSearchRecords.month)).group_by(StopSearchRecords.month).all()
            for i in results:
                x.append(i[0])
                y.append(i[1])
        return {'x': x, 'y': y, 'type': 'bar'}
    return app