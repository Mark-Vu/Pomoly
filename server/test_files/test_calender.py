from datetime import date
import json
from flask import jsonify
from server import create_app
from server.app import app
from server.models import db, User, Event,Note
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity,
    create_refresh_token, set_access_cookies, set_refresh_cookies
        )
from flask_jwt_extended import verify_jwt_in_request
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

# def test_add_event(client):
#     with app.app_context():
#         user = User.query.filter_by(email='dohoaan2003@gmail.com').first()
#         assert user is not None
#         valid_jwt_token = create_access_token(identity=user.id)
#         print(valid_jwt_token)

#     event_data = {
#         'calender_id': 678,
#         'title': "Test Event",
#         'date': "2023-11-08",
#         'time': "12:00"
#     }

#     response = client.post("/calendar/add-event",json=event_data, cookies={'access_token_cookie': valid_jwt_token})
    
#     assert response.status_code == 200
#     assert b'Event added successfully' in response.data

# def test_add_note(client):
#     email = 'dohoaan2003@gmail.com'
#     data = {'email': email,
#             'verification_code': '4T6PW6'}
#     response = client.post('/users/auth/login', json=data)
#     print(client.cookies.get_dict())
    # response = client.post("/note/add-note", 
    #                                 json={
    #                                     "title": "Test Note",
    #                                     "content": "This is a test note.",
    #                                     "date": "2023-01-01",
    #                                     "last_modified_date": "2023-01-02",
    #                                     "last_modified_time": "12:00:00"
    #                                 },headers={"user_id": user_id})
    # # Assertions
    # assert response.status_code == 201
    # assert response.json == {"message": "Note added successfully"}