import secrets
from datetime import datetime, timedelta
from . import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=True)

    def __init__(self, email, name=None):
        self.email = email
        self.name = name
