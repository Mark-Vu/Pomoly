from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from server.config import Config
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, supports_credentials=True)

    jwt = JWTManager(app)

    db.init_app(app)
    migrate.init_app(app, db)

    from server.auth import bp as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    from server.api import bp as api_blueprint
    app.register_blueprint(api_blueprint)
    
    from server.calendar import bp as calendar_blueprint
    app.register_blueprint(calendar_blueprint)
    
    from server.note import bp as note_blueprint
    app.register_blueprint(note_blueprint)

    mail.init_app(app)
        
    return app
