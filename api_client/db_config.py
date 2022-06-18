from os import getenv


DB_CONFIG = {'host':'localhost',
'database':'police_records',
'user':getenv('USER', 'postgres'),
'password':''}