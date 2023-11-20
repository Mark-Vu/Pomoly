import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Db config
DB_URI = os.environ.get('DB_URI')


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT')
    SQLALCHEMY_DATABASE_URI= DB_URI
    CORS_SUPPORTS_CREDENTIALS=True
    
    # JWT config
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=20);
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=90); # Session expired after 90 days
    JWT_TOKEN_LOCATION = ["cookies"]  # Storing jwt token in  cookie to prevent XSS
    JWT_COOKIE_SECURE = True  # Only allow cookies to be sent over Https
    JWT_COOKIE_CSRF_PROTECT = True  # Enabling sending CSRF tokens over cookie
    JWT_COOKIE_SAMESITE = "None" 
    JWT_CSRF_IN_COOKIES = False

    # mail settings
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.environ['APP_MAIL_USERNAME']
    MAIL_PASSWORD = os.environ['APP_MAIL_PASSWORD']
    MAIL_DEFAULT_SENDER = os.environ['MAIL_DEFAULT_SENDER']