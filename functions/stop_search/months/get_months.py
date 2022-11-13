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

def get_months(event, context):
    with Session(engine) as session:
        forces_to_filter = event['queryStringParameters']['force']
        available_months = session.execute(
                '''SELECT date 
                   FROM stop_search_records
                   WHERE force_id = :force 
                   GROUP BY 1''', {'force': forces_to_filter}).all()
        available_months = [row[0] for row in available_months]
    
    return {
        'statusCode': 200,
        'body': json.dumps(sorted(available_months)[2:], default=str)
    }