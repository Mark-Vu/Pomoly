# test_app.py
import json
from server.app import app
from server.models import db
from server.models import User  
from unittest.mock import patch
import pytest

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    # Create a testing database
    with app.app_context():
        db.create_all()

    yield client

    with app.app_context():
        db.session.remove()
        # Specify the specific tables to drop
        db.metadata.clear()
        db.reflect()
        db.drop_all()

def test_enter_email(client):
    # Prepare test data
    email = 'studyhub@gmail.com'
    data = {'email': email}

    # Make a POST request
    response = client.post('/users/auth/email', json=data)

    # Check the response
    assert response.status_code == 200
    assert b'Please verify your email' in response.data

    # Query the test database to check if the user's email exists
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        assert user is not None

    if user is not None:
        print(f"Success: Email {email} exists in the database")
