import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Db config
DB_URI = f'postgresql://rpwfjpre:xD_YkaDhL5X94cEYuWWyC5bSK5rcBgfD@batyr.db.elephantsql.com/rpwfjpre'


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT')
    SQLALCHEMY_DATABASE_URI= DB_URI
    CORS_SUPPORTS_CREDENTIALS=True
    # JWT config
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=90)
    JWT_TOKEN_LOCATION = ["cookies"]  # Storing jwt token in  cookie to prevent XSS
    JWT_COOKIE_SECURE = True  # Only allow cookies to be sent over Http
    JWT_COOKIE_CSRF_PROTECT = True  # Enabling sending CSRF tokens over cookie
    JWT_COOKIE_SAMESITE = "LAX"  # Only allow to send cookie to the same site
    
    # mail settings
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.environ['APP_MAIL_USERNAME']
    MAIL_PASSWORD = os.environ['APP_MAIL_PASSWORD']
    MAIL_DEFAULT_SENDER = os.environ['MAIL_DEFAULT_SENDER']