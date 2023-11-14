import secrets
from datetime import datetime, timedelta
from . import db
import string
import random

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=True)
    
    # Define a one-to-one relationship with Calendar.
    calendar = db.relationship('Calendar', uselist=False, backref='User', passive_deletes=True)
    notes = db.relationship('Note', backref='User', passive_deletes=True)
    verification_code = db.relationship('VerificationCode', uselist=False, backref='User', passive_deletes=True)

    def __init__(self, email, name=None):
        self.email = email
        self.name = name
        self.calendar = Calendar()
        self.verification_code = VerificationCode()


class VerificationCode(db.Model):
    __tablename__ = 'verification_codes'

    id = db.Column(db.Integer(), primary_key=True)
    code = db.Column(db.String(6), unique=True, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    expiration_time = db.Column(db.DateTime, nullable=False)

    def __init__(self):
        self.set_new_code()

    def confirm_verification_code(self, input_code):
        input_code = " ".join(input_code.split())
        current_time = datetime.utcnow()
        if self.code == input_code:
            if current_time <= self.expiration_time:
                return "valid" 
            else:
                return "expired"  
        else:
            return "incorrect"  

    def set_new_code(self):
        self.code = VerificationCode.generate_random_code()
        self.expiration_time = datetime.utcnow() + timedelta(minutes=10)
        db.session.commit()
    
    @staticmethod
    def generate_random_code(length=6):
        code_characters = string.ascii_uppercase + string.digits
        code = ''.join(random.choice(code_characters) for _ in range(length))
        return code
    # The function for sending the email is under server/auth/email.py

class Calendar(db.Model):
    __tablename__ = 'calendars'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Define a one-to-many relationship with Event.
    events = db.relationship('Event', backref='calendar', passive_deletes=True)
    

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer(), primary_key=True)
    calendar_id = db.Column(db.Integer(), db.ForeignKey('calendars.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    time = db.Column(db.String(), nullable=True)
    
    def __init__(self, calendar_id, title, date, time):
        self.calendar_id = calendar_id
        self.title = title
        self.date = date
        self.time = time


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    last_modified_date = db.Column(db.Date(), nullable=False)
    last_modified_time = db.Column(db.Time(), nullable=False)
    title = db.Column(db.String(), nullable=True)
    content = db.Column(db.String(), nullable=True)

    def __init__(self, user_id, date, title, content, last_modified_date, last_modified_time):
        self.user_id = user_id
        self.date = date
        self.title = title
        self.content = content
        self.last_modified_date = last_modified_date
        self.last_modified_time = last_modified_time