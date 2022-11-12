import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import Session, declarative_base
from sqlalchemy.exc import IntegrityError
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
Base = declarative_base()

class User(Base):
    __tablename__ = 'users_registered'

    id = Column(Integer, primary_key = True)
    firstName = Column(String, nullable = True)
    email = Column(String, nullable = False, unique=True)

def signup(event, context):
    with Session(engine) as session:
        firstName = event['body']['firstName']
        email = event['body']['email']
        
        #check if user is already registered
        inputs = {'firstName': firstName, 'email': email}
        user_exists = session.execute('SELECT * FROM users_registered WHERE "firstName"=:firstName and "email"=:email', inputs).all()
        
        if user_exists == []:
            try:
                user = User(**event['body'])
                session.add(user)
                session.commit()
                if firstName == '':
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{email} is now subscribed"}
                else:
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{firstName} is now subscribed"}
                return {
                        'statusCode': 200,
                        'body': response
                }
            except IntegrityError:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
                return {
                        'statusCode': 200,
                        'body': response
                }
        else:
            if firstName == '':
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
            else:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{firstName} is already subscribed"}
            return {
                    'statusCode': 200,
                    'body': response
            }