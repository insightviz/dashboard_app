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

def get_enhanced_data(event):
    with Session(engine) as session:
        if 'month' not in event['queryStringParameters'].keys():
            if all([key not in event['queryStringParameters'].keys() for key in ['ethnicity', 'gender']]):
                force_to_filter = event['queryStringParameters']['force']
                stop_searches = session.execute(
                    '''SELECT date, count(*) 
                       FROM stop_search_records 
                       WHERE (
                              force_id = :force
                              AND
                              date > (
                                  SELECT max(date) - INTERVAL '1 year' 
                                  FROM stop_search_records
                                  WHERE force_id = :force)
                       ) 
                       GROUP BY 1
                       ORDER BY 1 ASC''', {'force': force_to_filter}).all()
                stop_searches = [{'x': str(row[0]), 'y': row[1]} for row in stop_searches]
                stop_searches_by_race = session.execute(
                    '''SELECT date, person_ethnicity, count(*) 
                       FROM stop_search_records 
                       WHERE (
                              force_id = :force
                              AND
                              date > (
                                  SELECT max(date) - INTERVAL '1 year' 
                                  FROM stop_search_records
                                  WHERE force_id = :force)
                       ) 
                       GROUP BY 1, 2
                       ORDER BY 1 ASC, 3 DESC''', {'force': force_to_filter}).all()              
                stop_searches_by_race = [{'x': str(row[0]), 'category': row[1], 'y': row[2]} for row in stop_searches_by_race if row[1]]
                stop_searches_by_gender = session.execute(
                    '''SELECT date, gender, count(*) 
                       FROM stop_search_records 
                       WHERE (
                              force_id = :force
                              AND
                              date > (
                                  SELECT max(date) - INTERVAL '1 year' 
                                  FROM stop_search_records
                                  WHERE force_id = :force)
                       ) 
                       GROUP BY 1, 2
                       ORDER BY 1 ASC, 3 DESC''', {'force': force_to_filter}).all()              
                stop_searches_by_gender = [{'x': str(row[0]), 'category': row[1], 'y': row[2]} for row in stop_searches_by_gender if row[1]]
            elif 'ethnicity' in event['queryStringParameters'].keys():
                force_to_filter = event['queryStringParameters']['force']
                ethnicity_to_filter = event['queryStringParameters']['ethnicity']
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
                       FROM stop_searches_by_officer_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
                no_stop_searches_by_police_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in no_stop_searches_by_police_ethnicity]
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
                       FROM outcomes_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
                stop_search_outcomes_by_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_outcomes_by_ethnicity]
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
                       FROM object_of_search_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter}).all()
                stop_search_object_of_search_by_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_object_of_search_by_ethnicity]

            else:
                force_to_filter = event['queryStringParameters']['force']
                gender_to_filter = event['queryStringParameters']['gender']
                stop_search_outcomes_by_gender = session.execute(
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
                                  gender = :gender) group by 1
                       )
                       SELECT outcome, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM outcomes_by_race) AS Percentage_of_Total
                       FROM outcomes_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'gender': gender_to_filter}).all()
                stop_search_outcomes_by_gender = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_outcomes_by_gender]
                stop_search_object_of_search_by_gender = session.execute(
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
                                  gender = :gender) group by 1
                       )
                       SELECT object_of_search, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM object_of_search_by_race) AS Percentage_of_Total
                       FROM object_of_search_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'gender': gender_to_filter}).all()
                stop_search_object_of_search_by_gender = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_object_of_search_by_gender]

        else: 
            if 'ethnicity' in event['queryStringParameters'].keys():
                force_to_filter = event['queryStringParameters']['force']
                ethnicity_to_filter = event['queryStringParameters']['ethnicity']
                month_to_filter = event['queryStringParameters']['month']+'-01'
                no_stop_searches_by_police_ethnicity = session.execute(
                    '''WITH stop_searches_by_officer_race AS (
                           SELECT officer_defined_ethnicity, count(*) 
                           FROM stop_search_records 
                           WHERE (date= :month
                                  AND
                                  force_id = :force
                                  AND 
                                  person_ethnicity = :ethnicity) group by 1
                       )
                       SELECT officer_defined_ethnicity, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM stop_searches_by_officer_race) AS Percentage_of_Total
                       FROM stop_searches_by_officer_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
                no_stop_searches_by_police_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in no_stop_searches_by_police_ethnicity]
                stop_search_outcomes_by_ethnicity = session.execute(
                    '''WITH outcomes_by_race AS (
                           SELECT outcome, count(*) 
                           FROM stop_search_records 
                           WHERE (date= :month
                                  AND
                                  force_id = :force
                                  AND 
                                  person_ethnicity = :ethnicity) group by 1
                       )
                       SELECT outcome, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM outcomes_by_race) AS Percentage_of_Total
                       FROM outcomes_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
                stop_search_outcomes_by_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_outcomes_by_ethnicity]
                stop_search_object_of_search_by_ethnicity = session.execute(
                    '''WITH object_of_search_by_race AS (
                           SELECT object_of_search, count(*) 
                           FROM stop_search_records 
                           WHERE (date= :month
                                  AND
                                  force_id = :force
                                  AND 
                                  person_ethnicity = :ethnicity) group by 1
                       )
                       SELECT object_of_search, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM object_of_search_by_race) AS Percentage_of_Total
                       FROM object_of_search_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'ethnicity': ethnicity_to_filter, 'month': month_to_filter}).all()
                stop_search_object_of_search_by_ethnicity = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_object_of_search_by_ethnicity]

            else:
                force_to_filter = event['queryStringParameters']['force']
                gender_to_filter = event['queryStringParameters']['gender']
                month_to_filter = event['queryStringParameters']['month']+'-01'
                stop_search_outcomes_by_gender = session.execute(
                    '''WITH outcomes_by_race AS (
                           SELECT outcome, count(*) 
                           FROM stop_search_records 
                           WHERE (date= :month
                                  AND
                                  force_id = :force
                                  AND 
                                  gender = :gender) group by 1
                       )
                       SELECT outcome, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM outcomes_by_race) AS Percentage_of_Total
                       FROM outcomes_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'gender': gender_to_filter, 'month': month_to_filter}).all()
                stop_search_outcomes_by_gender = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_outcomes_by_gender]
                stop_search_object_of_search_by_gender = session.execute(
                    '''WITH object_of_search_by_race AS (
                           SELECT object_of_search, count(*) 
                           FROM stop_search_records 
                           WHERE (date= :month
                                  AND
                                  force_id = :force
                                  AND 
                                  gender = :gender) group by 1
                       )
                       SELECT object_of_search, count, 
                              (count*100)/(SELECT SUM(count) 
                                           FROM object_of_search_by_race) AS Percentage_of_Total
                       FROM object_of_search_by_race
                       ORDER BY 2 DESC''', {'force': force_to_filter, 'gender': gender_to_filter, 'month': month_to_filter}).all()
                stop_search_object_of_search_by_gender = [{'label': re.sub('^\s*$', 'Not Defined', str(row[0]).replace('None', 'Not defined')), 'count': row[1], 'percentage': str(round(row[2], 1))} for row in stop_search_object_of_search_by_gender]

        if all([key in event['queryStringParameters'].keys() for key in ['force', 'ethnicity']]):
            results = {'ethnicity_data': {
                            'breakdown_by_police_ethnicity': no_stop_searches_by_police_ethnicity,
                            'breakdown_of_outcomes_by_ethnicity': stop_search_outcomes_by_ethnicity,
                            'breakdown_of_object_of_search_by_ethnicity': stop_search_object_of_search_by_ethnicity
                       },
                       }
        elif all([key in event['queryStringParameters'].keys() for key in ['force', 'gender']]):
            results = {'gender_data': {
                            'breakdown_of_outcomes_by_gender': stop_search_outcomes_by_gender,
                            'breakdown_of_object_of_search_by_gender': stop_search_object_of_search_by_gender
                       },
                       }
        else: 
            results = {'overall_enhanced_data': {
                            'past_monthly_stop_search': stop_searches,
                            'past_monthly_stop_search_breakdown_by_race': stop_searches_by_race,
                            'past_monthly_stop_search_breakdown_by_gender': stop_searches_by_gender
                            },
                        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(results)
    }