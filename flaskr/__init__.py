import os
from flask import Flask, render_template, request
from flask_cors import CORS
from db.config import CONNECTION_STRING
from dashboards.stop_search_dashboard.utils.helper_functions import load_from_json
from flaskr.model import *
from sqlalchemy.exc import IntegrityError


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = CONNECTION_STRING
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        db.create_all()

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
        x, y = [], []
        if request.args == {}:
            results = db.session.execute('SELECT date, COUNT(*) FROM stop_search_records GROUP BY 1 ORDER BY 1 DESC LIMIT 12').all()
        else:
            forces_to_filter = tuple(request.args['force'].split(','))
            results = db.session.execute('SELECT date, COUNT(*) FROM stop_search_records WHERE force_id in :force GROUP BY 1 ORDER BY 1 DESC LIMIT 12', {'force': forces_to_filter}).all()
        for i in results:
            x.append(i[0])
            y.append(i[1])
        return {'chart1': {'x': x, 'y': y, 'type': 'bar'}}

    @app.route('/stopsearchmain')
    def stopsearchmain():
        if request.args != {}:
            forces_to_filter = tuple(request.args['force'].split(','))
            ethnicity_to_filter = tuple(request.args['ethnicity'].split(','))
            no_stop_searches = db.session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date_trunc('month', datetime)=
                         (SELECT date_trunc('month', max(datetime)) as max_month 
                          FROM stop_search_records
                          WHERE force_id in :force) 
                          AND
                          force_id in :force)''', {'force': forces_to_filter}).one()
            no_stop_searches_pm = db.session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date_trunc('month', datetime)=
                         (SELECT date_trunc('month', max(datetime)) - INTERVAL '1 month' 
                          FROM stop_search_records
                          WHERE force_id in :force)
                          AND
                          force_id in :force)''', {'force': forces_to_filter}).one()
            pct_change = (no_stop_searches[0] - no_stop_searches_pm[0])*100/no_stop_searches_pm[0]
            no_stop_searches_by_race = db.session.execute(
                '''WITH stop_searches_by_race AS (
                       SELECT person_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime)=(
                              SELECT date_trunc('month', max(datetime)) as max_month 
                              FROM stop_search_records
                              WHERE force_id in :force)
                              AND
                              force_id in :force) group by 1
                   )
                   SELECT person_ethnicity, count, (count*100)/(SELECT SUM(count) 
                                                                FROM stop_searches_by_race) AS Percentage_of_Total
                   FROM stop_searches_by_race''', {'force': forces_to_filter}).all()
            x = [str(row[0]).replace('None', 'Not defined') for row in no_stop_searches_by_race]
            y = [row[1] for row in no_stop_searches_by_race]
            text = [f'{row[1]}, ({round(row[2], 2)}%)' for row in no_stop_searches_by_race]
            no_stop_searches_by_race = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            no_stop_searches_by_police_ethnicity = db.session.execute(
                '''WITH stop_searches_by_officer_race AS (
                       SELECT officer_defined_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime)=(
                              SELECT date_trunc('month', max(datetime)) as max_month 
                              FROM stop_search_records
                              WHERE force_id in :force)
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT officer_defined_ethnicity, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM stop_searches_by_officer_race) AS Percentage_of_Total
                   FROM stop_searches_by_officer_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [str(row[0]).replace('None', 'Not defined') for row in no_stop_searches_by_police_ethnicity]
            y = [row[1] for row in no_stop_searches_by_police_ethnicity]
            text = [f'{row[1]}, ({round(row[2], 2)}%)' for row in no_stop_searches_by_police_ethnicity]
            no_stop_searches_by_police_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_outcomes_by_ethnicity = db.session.execute(
                '''WITH outcomes_by_race AS (
                       SELECT outcome, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime)=(
                              SELECT date_trunc('month', max(datetime)) as max_month 
                              FROM stop_search_records
                              WHERE force_id in :force)
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT outcome, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM outcomes_by_race) AS Percentage_of_Total
                   FROM outcomes_by_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [str(row[0]).replace('None', 'Not defined') for row in stop_search_outcomes_by_ethnicity]
            y = [row[1] for row in stop_search_outcomes_by_ethnicity]
            text = [f'{row[1]}, ({round(row[2], 2)}%)' for row in stop_search_outcomes_by_ethnicity]
            stop_search_outcomes_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_object_of_search_by_ethnicity = db.session.execute(
                '''WITH object_of_search_by_race AS (
                       SELECT object_of_search, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime)=(
                              SELECT date_trunc('month', max(datetime)) as max_month 
                              FROM stop_search_records
                              WHERE force_id in :force)
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT object_of_search, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM object_of_search_by_race) AS Percentage_of_Total
                   FROM object_of_search_by_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [str(row[0]).replace('None', 'Not defined') for row in stop_search_object_of_search_by_ethnicity]
            y = [row[1] for row in stop_search_object_of_search_by_ethnicity]
            text = [f'{row[1]}, ({round(row[2], 2)}%)' for row in stop_search_object_of_search_by_ethnicity]
            stop_search_object_of_search_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}

        results = {'figure_1': {'monthly_no_stop_search': no_stop_searches[0],
                                'pct_change': round(pct_change, 2)},
                   'breakdown_by_race': no_stop_searches_by_race,
                   'breakdown_by_police_ethnicity': no_stop_searches_by_police_ethnicity,
                   'breakdown_of_outcomes_by_ethnicity': stop_search_outcomes_by_ethnicity,
                   'breakdown_of_object_of_search_by_ethnicity': stop_search_object_of_search_by_ethnicity}
        return results

    @app.route('/stopsearch/forces')
    def forces():
        return load_from_json('dashboards/stop_search_dashboard/data/police_forces.json')
    
    @app.route('/signup', methods=['POST'])
    def signup():
        firstName = request.json['firstName']
        email = request.json['email']
        
        #check if user is already registered
        inputs = {'firstName': firstName, 'email': email}
        user_exists = db.session.execute('SELECT * FROM users_registered WHERE "firstName"=:firstName and "email"=:email', inputs).all()
        
        if user_exists == []:
            try:
                user = User(**request.json)
                db.session.add(user)
                db.session.commit()
                if firstName == '':
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{email} is now subscribed"}
                else:
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{firstName} is now subscribed"}
                return response
            except IntegrityError:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
                return response
        else:
            if firstName == '':
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
            else:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{firstName} is already subscribed"}
            return response
    return app