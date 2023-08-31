from flask import Flask
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

load_dotenv()


# Configure PostgreSQL
user = os.environ.get('DB_USER')
db_name = os.environ.get("DB_NAME")
password = os.environ.get('DB_PWD')
DB_URI = f'postgresql://{user}:{password}@localhost/{db_name}'
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    jwt = JWTManager(app)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') 
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
    
    from server.auth import bp as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    from server.api import bp as api_blueprint
    app.register_blueprint(api_blueprint)
    
    db.init_app(app)
    with app.app_context():
        db.create_all()
        
    return app
