import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from flask_sqlalchemy import SQLAlchemy
import re

static_directory = os.getcwd()+f'/build/static'

def create_app():
    # create and configure the app
    app = Flask(__name__)
    CORS(app)
    environment_configuration = os.environ['CONFIGURATION_SETUP']
    app.config.from_object(environment_configuration)

    db = SQLAlchemy()

    # initialize the app with the extension
    db.init_app(app)
    
    @app.route('/')
    def home():
        path = os.getcwd()+f'/build'
        return send_from_directory(directory=path, path='index.html')

    @app.route('/static/<folder>/<file>')
    def css(folder, file):
        path = folder + '/' + file
        return send_from_directory(directory=static_directory, path=path)

    @app.route('/stopsearch/data')
    def stopsearchdata():
        if 'month' not in request.args.keys():
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
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_race]
            y = [row[1] for row in no_stop_searches_by_race]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_race]
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
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_police_ethnicity]
            y = [row[1] for row in no_stop_searches_by_police_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_police_ethnicity]
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
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_outcomes_by_ethnicity]
            y = [row[1] for row in stop_search_outcomes_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_outcomes_by_ethnicity]
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
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_object_of_search_by_ethnicity]
            y = [row[1] for row in stop_search_object_of_search_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_object_of_search_by_ethnicity]
            stop_search_object_of_search_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}

        else:
            forces_to_filter = tuple(request.args['force'].split(','))
            ethnicity_to_filter = tuple(request.args['ethnicity'].split(','))
            month_to_filter = request.args['month']+'-01'
            no_stop_searches = db.session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date_trunc('month', datetime) = :month  
                          AND
                          force_id in :force)''', {'force': forces_to_filter, 'month': month_to_filter}).one()
            no_stop_searches_pm = db.session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date_trunc('month', datetime) = (:month ::date - INTERVAL '1 month')
                          AND
                          force_id in :force)''', {'force': forces_to_filter, 'month': month_to_filter}).one()
            pct_change = (no_stop_searches[0] - no_stop_searches_pm[0])*100/no_stop_searches_pm[0]
            no_stop_searches_by_race = db.session.execute(
                '''WITH stop_searches_by_race AS (
                       SELECT person_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime) = :month
                              AND
                              force_id in :force) group by 1
                   )
                   SELECT person_ethnicity, count, (count*100)/(SELECT SUM(count) 
                                                                FROM stop_searches_by_race) AS Percentage_of_Total
                   FROM stop_searches_by_race''', {'force': forces_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_race]
            y = [row[1] for row in no_stop_searches_by_race]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_race]
            no_stop_searches_by_race = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            no_stop_searches_by_police_ethnicity = db.session.execute(
                '''WITH stop_searches_by_officer_race AS (
                       SELECT officer_defined_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime) = :month
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT officer_defined_ethnicity, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM stop_searches_by_officer_race) AS Percentage_of_Total
                   FROM stop_searches_by_officer_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_police_ethnicity]
            y = [row[1] for row in no_stop_searches_by_police_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_police_ethnicity]
            no_stop_searches_by_police_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_outcomes_by_ethnicity = db.session.execute(
                '''WITH outcomes_by_race AS (
                       SELECT outcome, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime) = :month
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT outcome, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM outcomes_by_race) AS Percentage_of_Total
                   FROM outcomes_by_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_outcomes_by_ethnicity]
            y = [row[1] for row in stop_search_outcomes_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_outcomes_by_ethnicity]
            stop_search_outcomes_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_object_of_search_by_ethnicity = db.session.execute(
                '''WITH object_of_search_by_race AS (
                       SELECT object_of_search, count(*) 
                       FROM stop_search_records 
                       WHERE (date_trunc('month', datetime) = :month
                              AND
                              force_id in :force
                              AND 
                              person_ethnicity in :ethnicity) group by 1
                   )
                   SELECT object_of_search, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM object_of_search_by_race) AS Percentage_of_Total
                   FROM object_of_search_by_race''', {'force': forces_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_object_of_search_by_ethnicity]
            y = [row[1] for row in stop_search_object_of_search_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_object_of_search_by_ethnicity]
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
        available_forces = db.session.execute(
                '''SELECT force_id 
                   FROM stop_search_records 
                   GROUP BY 1''').all()
        available_forces = [row[0] for row in available_forces]
        return jsonify(available_forces)

    @app.route('/stopsearch/months')
    def months():
        forces_to_filter = request.args['force']
        available_months = db.session.execute(
                '''SELECT date_trunc('month', datetime) 
                   FROM stop_search_records
                   WHERE force_id = :force 
                   GROUP BY 1''', {'force': forces_to_filter}).all()
        available_months = [row[0] for row in available_months]
        return jsonify(sorted(available_months)[2:])
          
    @app.route('/stopsearch/ethnicity')
    def ethnicity():
        if 'month' not in request.args.keys():
            forces_to_filter = request.args['force']
            available_ethnicity = db.session.execute(
                    '''SELECT person_ethnicity 
                       FROM stop_search_records
                       WHERE (date_trunc('month', datetime)=(
                              SELECT date_trunc('month', max(datetime)) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force)
                       GROUP BY 1''', {'force': forces_to_filter}).all()
        
        else:
            forces_to_filter = request.args['force']
            month_to_filter = request.args['month']+'-01'
            available_ethnicity = db.session.execute(
                    '''SELECT person_ethnicity 
                       FROM stop_search_records
                       WHERE (date_trunc('month', datetime) = :month
                              AND
                              force_id = :force)
                       GROUP BY 1''', {'force': forces_to_filter, 'month': month_to_filter}).all()
        
        available_ethnicity = [row[0] for row in available_ethnicity]
        return jsonify(available_ethnicity)

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