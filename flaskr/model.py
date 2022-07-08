from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users_registered'
    id = db.Column(db.Integer, primary_key =True)
    firstName = db.Column(db.String, nullable = False)
    lastName = db.Column(db.String, nullable = True)
    email = db.Column(db.String, nullable = False)