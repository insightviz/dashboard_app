import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import json
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

def get_ethnicity(event, context):
    with Session(engine) as session:
        if 'month' not in event['queryStringParameters'].keys():
            forces_to_filter = event['queryStringParameters']['force']
            available_ethnicity = session.execute(
                    '''SELECT person_ethnicity 
                       FROM stop_search_records
                       WHERE (date=(
                              SELECT max(date) as max_month 
                              FROM stop_search_records
                              WHERE force_id = :force)
                              AND
                              force_id = :force)
                       GROUP BY 1''', {'force': forces_to_filter}).all()
        
        else:
            forces_to_filter = event['queryStringParameters']['force']
            month_to_filter = event['queryStringParameters']['month']+'-01'
            available_ethnicity = session.execute(
                    '''SELECT person_ethnicity 
                       FROM stop_search_records
                       WHERE (date = :month
                              AND
                              force_id = :force)
                       GROUP BY 1''', {'force': forces_to_filter, 'month': month_to_filter}).all()
        
        available_ethnicity = [row[0] for row in available_ethnicity]
    
    return {
        'statusCode': 200,
        'body': json.dumps(available_ethnicity)
    }