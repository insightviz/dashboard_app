import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import json
import re
import botocore 
import botocore.session 
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig 

client = botocore.session.get_session().create_client('secretsmanager')
cache_config = SecretCacheConfig(secret_refresh_interval=2592000)
cache = SecretCache( config = cache_config, client = client)

secret = cache.get_secret_string('insightviz_database_secret')

# gets database credentials from environment variable in aws cloud instance
CREDENTIALS = json.loads(secret)
HOST = os.environ.get('proxy_endpoint')

CONNECTION_STRING = f"postgresql://{CREDENTIALS['username']}:{CREDENTIALS['password']}@{HOST}/{CREDENTIALS['dbname']}"
# connect with data
engine = create_engine(url=CONNECTION_STRING, echo=True)

def get_data(event, context):
    with Session(engine) as session:
        if 'month' not in event['queryStringParameters'].keys():
            force_to_filter = event['queryStringParameters']['force']
            ethnicity_to_filter = event['queryStringParameters']['ethnicity']
            no_stop_searches = session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date=
                         (SELECT max(date) as max_month 
                          FROM stop_search_records
                          WHERE force_id = :force) 
                          AND
                          force_id = :force)''', {'force': force_to_filter}).one()
            no_stop_searches_pm = session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date=
                         (SELECT max(date) - INTERVAL '1 month' 
                          FROM stop_search_records
                          WHERE force_id = :force)
                          AND
                          force_id = :force)''', {'force': force_to_filter}).one()
            if no_stop_searches_pm[0] == 0:
                pct_change = 'N/A'
            else:
                pct_change = (no_stop_searches[0] - no_stop_searches_pm[0])*100/no_stop_searches_pm[0]
                pct_change = round(pct_change, 2)
            no_stop_searches_by_race = session.execute(
                '''WITH stop_searches_by_race AS (
                       SELECT person_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date=(
                              SELECT max(date) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force) group by 1
                   )
                   SELECT person_ethnicity, count, (count*100)/(SELECT SUM(count) 
                                                                FROM stop_searches_by_race) AS Percentage_of_Total
                   FROM stop_searches_by_race''', {'force': force_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_race]
            y = [row[1] for row in no_stop_searches_by_race]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_race]
            no_stop_searches_by_race = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            no_stop_searches_by_police_ethnicity = session.execute(
                '''WITH stop_searches_by_officer_race AS (
                       SELECT officer_defined_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date=(
                              SELECT max(date) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT officer_defined_ethnicity, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM stop_searches_by_officer_race) AS Percentage_of_Total
                   FROM stop_searches_by_officer_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_police_ethnicity]
            y = [row[1] for row in no_stop_searches_by_police_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_police_ethnicity]
            no_stop_searches_by_police_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_outcomes_by_ethnicity = session.execute(
                '''WITH outcomes_by_race AS (
                       SELECT outcome, count(*) 
                       FROM stop_search_records 
                       WHERE (date=(
                              SELECT max(date) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT outcome, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM outcomes_by_race) AS Percentage_of_Total
                   FROM outcomes_by_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_outcomes_by_ethnicity]
            y = [row[1] for row in stop_search_outcomes_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_outcomes_by_ethnicity]
            stop_search_outcomes_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_object_of_search_by_ethnicity = session.execute(
                '''WITH object_of_search_by_race AS (
                       SELECT object_of_search, count(*) 
                       FROM stop_search_records 
                       WHERE (date=(
                              SELECT max(date) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT object_of_search, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM object_of_search_by_race) AS Percentage_of_Total
                   FROM object_of_search_by_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_object_of_search_by_ethnicity]
            y = [row[1] for row in stop_search_object_of_search_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_object_of_search_by_ethnicity]
            stop_search_object_of_search_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}

        else:
            force_to_filter = event['queryStringParameters']['force']
            ethnicity_to_filter = event['queryStringParameters']['ethnicity']
            month_to_filter = event['queryStringParameters']['month']+'-01'
            no_stop_searches = session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date = :month  
                          AND
                          force_id = :force)''', {'force': force_to_filter, 'month': month_to_filter}).one()
            no_stop_searches_pm = session.execute(
                '''SELECT count(*) 
                   FROM stop_search_records 
                   WHERE (date = (:month ::date - INTERVAL '1 month')
                          AND
                          force_id = :force)''', {'force': force_to_filter, 'month': month_to_filter}).one()
            if no_stop_searches_pm[0] == 0:
                pct_change = 'N/A'
            else:
                pct_change = (no_stop_searches[0] - no_stop_searches_pm[0])*100/no_stop_searches_pm[0]
                pct_change = round(pct_change, 2)
            no_stop_searches_by_race = session.execute(
                '''WITH stop_searches_by_race AS (
                       SELECT person_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date = :month
                              AND
                              force_id = :force) group by 1
                   )
                   SELECT person_ethnicity, count, (count*100)/(SELECT SUM(count) 
                                                                FROM stop_searches_by_race) AS Percentage_of_Total
                   FROM stop_searches_by_race''', {'force': force_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_race]
            y = [row[1] for row in no_stop_searches_by_race]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_race]
            no_stop_searches_by_race = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            no_stop_searches_by_police_ethnicity = session.execute(
                '''WITH stop_searches_by_officer_race AS (
                       SELECT officer_defined_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (date = :month
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT officer_defined_ethnicity, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM stop_searches_by_officer_race) AS Percentage_of_Total
                   FROM stop_searches_by_officer_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in no_stop_searches_by_police_ethnicity]
            y = [row[1] for row in no_stop_searches_by_police_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in no_stop_searches_by_police_ethnicity]
            no_stop_searches_by_police_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_outcomes_by_ethnicity = session.execute(
                '''WITH outcomes_by_race AS (
                       SELECT outcome, count(*) 
                       FROM stop_search_records 
                       WHERE (date = :month
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT outcome, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM outcomes_by_race) AS Percentage_of_Total
                   FROM outcomes_by_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_outcomes_by_ethnicity]
            y = [row[1] for row in stop_search_outcomes_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_outcomes_by_ethnicity]
            stop_search_outcomes_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}
            stop_search_object_of_search_by_ethnicity = session.execute(
                '''WITH object_of_search_by_race AS (
                       SELECT object_of_search, count(*) 
                       FROM stop_search_records 
                       WHERE (date = :month
                              AND
                              force_id = :force
                              AND 
                              person_ethnicity = :ethnicity) group by 1
                   )
                   SELECT object_of_search, count, 
                          (count*100)/(SELECT SUM(count) 
                                       FROM object_of_search_by_race) AS Percentage_of_Total
                   FROM object_of_search_by_race''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
            x = [re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')) for row in stop_search_object_of_search_by_ethnicity]
            y = [row[1] for row in stop_search_object_of_search_by_ethnicity]
            text = [f'{row[1]} ({round(row[2], 1)}%)' for row in stop_search_object_of_search_by_ethnicity]
            stop_search_object_of_search_by_ethnicity = {'x': x, 'y': y, 'type': 'bar', 'text': text}

        if no_stop_searches[0] == 0:
            return {'statusCode': 400,
                    'body': json.dumps(f"No data available for {force_to_filter[0].replace('-', ' ')} police force!")}
        else:
            results = {'figure_1': {'monthly_no_stop_search': no_stop_searches[0],
                                    'pct_change': pct_change},
                       'breakdown_by_race': no_stop_searches_by_race,
                       'breakdown_by_police_ethnicity': no_stop_searches_by_police_ethnicity,
                       'breakdown_of_outcomes_by_ethnicity': stop_search_outcomes_by_ethnicity,
                       'breakdown_of_object_of_search_by_ethnicity': stop_search_object_of_search_by_ethnicity}
    
    return {
        'statusCode': 200,
        'body': json.dumps(results)
    }