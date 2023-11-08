from datetime import date
from server.app import app
from server.models import db, User, Event
from flask_jwt_extended import create_access_token
import pytest
@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    # Create a testing database
    with app.app_context():
        db.create_all()

    yield client

def test_add_event(client):
    with app.app_context():
        new_user = User(email='testuser1@example.com')
        db.session.add(new_user)
        db.session.commit()
