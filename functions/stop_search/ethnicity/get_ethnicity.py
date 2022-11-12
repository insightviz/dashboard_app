import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import json
import boto3
from botocore.exceptions import ClientError

def get_secret():

    secret_name = "insightviz_database_secret"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    # Decrypts secret using the associated KMS key.
    secret = get_secret_value_response['SecretString']

    return secret

# gets database credentials from environment variable in aws cloud instance
CREDENTIALS = json.loads(get_secret())
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