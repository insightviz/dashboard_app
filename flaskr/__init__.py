import os
from flask import Flask, render_template, request
from flask_cors import CORS
from db.config import CONNECTION_STRING
from dashboards.stop_search_dashboard.utils.helper_functions import load_from_json
from flaskr.model import *
from sqlalchemy.exc import IntegrityError


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = CONNECTION_STRING
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        db.create_all()

    app.config.from_mapping(
        SECRET_KEY='dev'
    )
    

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/contact')
    def contact():
        return render_template('contact.html')

    @app.route('/stopsearch')
    def stopsearch():
        x, y = [], []
        if request.args == {}:
            results = db.session.execute('SELECT month, COUNT(*) FROM stop_search_records GROUP BY month ORDER BY month DESC LIMIT 12').all()
        else:
            forces_to_filter = tuple(request.args['force'].split(','))
            results = db.session.execute('SELECT month, COUNT(*) FROM stop_search_records WHERE force_id in :force GROUP BY month ORDER BY month DESC LIMIT 12', {'force': forces_to_filter}).all()
        for i in results:
            x.append(i[0])
            y.append(i[1])
        return {'chart1': {'x': x, 'y': y, 'type': 'bar'}}

    @app.route('/stopsearch/forces')
    def forces():
        return load_from_json('dashboards/stop_search_dashboard/data/police_forces.json')
    
    @app.route('/signup', methods=['POST'])
    def signup():
        firstName = request.json['firstName']
        email = request.json['email']
        
        #check if user is already registered
        inputs = {'firstName': firstName, 'email': email}
        user_exists = db.session.execute('SELECT * FROM users_registered WHERE "firstName"=:firstName and "email"=:email', inputs).all()
        
        if user_exists == []:
            try:
                user = User(**request.json)
                db.session.add(user)
                db.session.commit()
                if firstName == '':
                    response = f"{email} is now registered"
                else:
                    response = f"{firstName} is now registered"
                return response
            except IntegrityError:
                response = f"Email: {email} has already been registered"
                return response
        else:
            if firstName == '':
                response = f"{email} is already registered"
            else:
                response = f"{firstName} is already registered"
            return response
    return app