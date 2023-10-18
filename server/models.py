import secrets
from datetime import datetime, timedelta
from . import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=True)
    
    # Define a one-to-one relationship with Calendar.
    calendar = db.relationship('Calendar', uselist=False, backref='user')
    notes = db.relationship('Note', backref='user', cascade='all, delete-orphan')
    

    def __init__(self, email, name=None):
        self.email = email
        self.name = name
        self.calendar = Calendar()
        
class Calendar(db.Model):
    __tablename__ = 'calendars'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    
    # Define a one-to-many relationship with Event.
    events = db.relationship('Event', backref='calendar', cascade='all, delete-orphan')
    

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer(), primary_key=True)
    calendar_id = db.Column(db.Integer(), db.ForeignKey('calendars.id'), nullable=False)
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