import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import Session, declarative_base
from sqlalchemy.exc import IntegrityError
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
Base = declarative_base()

class User(Base):
    __tablename__ = 'users_registered'

    id = Column(Integer, primary_key = True)
    firstName = Column(String, nullable = True)
    email = Column(String, nullable = False, unique=True)

def signup(event, context):
    with Session(engine) as session:
        user_data = json.loads(event['body'])
        firstName = user_data['firstName'].lower()
        email = user_data['email'].lower()
        
        #check if user is already registered
        user_data = {'firstName': firstName, 'email': email}
        user_exists = session.execute('SELECT * FROM users_registered WHERE "firstName"=:firstName and "email"=:email', user_data).all()
        
        if user_exists == []:
            try:
                user = User(**user_data)
                session.add(user)
                session.commit()
                if firstName == '':
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{email} is now subscribed"}
                else:
                    response = {'status': 'success', 'title': 'Subscribed', 'message': f"{firstName.capitalize()} is now subscribed"}
                return {
                        'statusCode': 200,
                        'body': json.dumps(response)
                }
            except IntegrityError:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
                return {
                        'statusCode': 200,
                        'body': json.dumps(response)
                }
        else:
            if firstName == '':
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{email} is already subscribed"}
            else:
                response = {'status': 'warning', 'title': 'Not subscribed', 'message': f"{firstName.capitalize()} is already subscribed"}
            return {
                    'statusCode': 200,
                    'body': json.dumps(response)
            }