import os

DB_CONFIG = {
    'db': os.getenv('DB_NAME', 'police_dashboard'),
    'user': os.getenv('USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
}