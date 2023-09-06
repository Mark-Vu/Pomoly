from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from server.config import Config
from flask_cors import CORS

db = SQLAlchemy()

mail = Mail()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # cors = CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    jwt = JWTManager(app)

    from server.auth import bp as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    from server.api import bp as api_blueprint
    app.register_blueprint(api_blueprint)

    db.init_app(app)
    mail.init_app(app)

    with app.app_context():
        db.create_all()
        
    return app
