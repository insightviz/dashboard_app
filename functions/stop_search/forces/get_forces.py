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

def get_forces(event, context):
    with Session(engine) as session:
        available_forces = session.execute(
                '''SELECT force_id 
                   FROM stop_search_records 
                   GROUP BY 1''').all()
        available_forces = [row[0] for row in available_forces]
    
    return {
        'statusCode': 200,
        'body': json.dumps(available_forces)
    }