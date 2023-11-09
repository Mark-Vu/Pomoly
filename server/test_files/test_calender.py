# from datetime import date
# from flask import jsonify
# from server.app import app
# from server.models import db, User, Event
# from flask_jwt_extended import (
#     create_access_token, jwt_required, get_jwt_identity,
#     create_refresh_token, set_access_cookies, set_refresh_cookies
#         )
# from flask_jwt_extended import verify_jwt_in_request
# import pytest
# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     client = app.test_client()

#     # Create a testing database
#     with app.app_context():
#         db.create_all()

#     yield client


# def test_add_event(client):
#     with app.app_context():
#         user = User.query.filter_by(email='testuser3@example.com').first()
#         assert user is not None
#         access_token = create_access_token(identity=user.id)
#         print(access_token)

#     event_data = {
#         'calender_id': 678,
#         'title': "Test Event",
#         'date': "2023-11-08",
#         'time': "12:00"
#     }
#     headers = {
#         'Authorization': 'Bearer {}'.format(access_token)
#     }

#     response = client.post("/calendar/add-event",json=event_data, headers=headers)
    
#     assert response.status_code == 200
#     assert b'Event added successfully' in response.data

# def create_jwt_tokens(user_id):
#     access_token = create_access_token(identity=user_id)
#     refresh_token = create_refresh_token(identity=user_id)
#     return access_token, refresh_token