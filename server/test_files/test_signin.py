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

def test_enter_email(client):
    email = 'dohoaan2003@gmail.com'
    data = {'email': email}

    # Make a POST request
    response = client.post('/users/auth/email', json=data)

    assert email is not None
    assert b'Please verify your email' in response.data

    with app.app_context():
        user = User.query.filter_by(email=email).first()
        assert user is not None

    with app.app_context():
        user = User.query.filter_by(email=email).first()
        assert user is not None

        db.session.delete(user)
        db.session.commit()
    print("\nSuccess: Email is in database")
    print("================================================================================")

def test_verification_code_in_db(client):
    email = 'dohoaan2003@gmail.com'
    data = {'email': email}

    # Make a POST request
    response = client.post('/users/auth/email', json=data)

    assert response.status_code == 202
    assert b'Please verify your email' in response.data

    with app.app_context():
        user = User.query.filter_by(email=email).first()
        assert user.verification_code is not None
        assert user.verification_code.code is not None
        veriCode = user.verification_code.code
        print(f"\nVerification Code: {veriCode}")
    
    print("Success: Verification code is in database")
    print("================================================================================")
        

def test_resend_verification_code_with_print(client):
    email = 'dohoaan2003@gmail.com'
    data = {'email': email}

    with app.app_context():
        user = User.query.filter_by(email=email).first()
        original_code = user.verification_code.code

    response = client.post('/users/auth/verification-code/resend', json=data)

    assert response.status_code == 200
    assert b'Verification code resent successfully' in response.data

    with app.app_context():
        user = User.query.filter_by(email=email).first()
        assert user is not None

        assert user.verification_code is not None
        new_code = user.verification_code.code

        assert new_code is not None
        print(f"\nOriginal Verification Code: {original_code}")
        print(f"New Verification Code: {new_code}")
        
    if user.verification_code.code is not None:
        print(f"Success: New code generate succesfully")
        print("================================================================================")

