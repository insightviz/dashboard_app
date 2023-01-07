import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import json
import botocore 
import botocore.session 
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig 
import redis

# Connect to the ElastiCache cache
CACHE_ENDPOINT = os.environ.get('cache_endpoint')
CACHE_PORT = os.environ.get('cache_port')
redis_cache = redis.Redis(host=CACHE_ENDPOINT, port=CACHE_PORT, db=0)

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
    function_path = 'months'
    cache_key = ''.join([function_path] + list(event['queryStringParameters'].values()))

    response = redis_cache.get(cache_key)
  
    if response is not None:
      # Return the response from the cache
      return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(json.loads(response))
       }
       
    else:
        with Session(engine) as session:
            forces_to_filter = event['queryStringParameters']['force']
            available_months = session.execute(
                    '''SELECT date 
                       FROM stop_search_records
                       WHERE force_id = :force 
                       GROUP BY 1''', {'force': forces_to_filter}).all()
            available_months = [row[0] for row in available_months]

            redis_cache.set(cache_key, json.dumps(sorted(available_months), default=str))

        return {
            'statusCode': 200,
            'body': json.dumps(sorted(available_months), default=str)
        }