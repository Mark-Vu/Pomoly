from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from src.config import Config
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    if os.environ.get("PRODUCTION") == "false":
        # Allow all origins in development
        CORS(app, supports_credentials=True)
    else:
        # Restrict origins in production
        CORS(app, origins=["https://pomoly.vercel.app"], supports_credentials=True)

    JWTManager(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from src.auth import bp as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    from src.api import bp as api_blueprint
    app.register_blueprint(api_blueprint)

    from src.user import bp as user_blueprint
    app.register_blueprint(user_blueprint)
    
    from src.calendar import bp as calendar_blueprint
    app.register_blueprint(calendar_blueprint)
    
    from src.note import bp as note_blueprint
    app.register_blueprint(note_blueprint)

    mail.init_app(app)
        
    return app
