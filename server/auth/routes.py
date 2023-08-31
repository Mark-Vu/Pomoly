from . import bp
from flask import request
from server.models import User
from server.api.errors import bad_request
from flask_jwt_extended import create_access_token;
from flask_jwt_extended import create_refresh_token;


@bp.route('/users/auth/email', method=["POST"])
def enter_email():
    data = request.get_json()
    if "email" not in data:
        return bad_request("Invalid input!")
    email = data["email"].lower().strip()
    user = User.query.filter_by(email).first()
    if user is None:
        return {"message": "Please verify your email"}, 202
    return {"message": "Please verify your email"}, 200


@bp.route('/users/auth/register', methods=["POST"])
def register():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data or "name" not in data:
        return bad_request("Invalid input!")
    email = data["email"].lower().strip()
    verification_code = data["verification_code"]
    name = data["name"]
    new_user = User(email=email, name=name)
    response, code_status = new_user.is_valid_code(verification_code)
    if code_status == 200:
        access_token, refresh_token = create_jwt_tokens(new_user.id)
        return {'access_token':access_token,
                'refresh_token':refresh_token
                }, code_status
    return response, code_status


@bp.route('/users/auth/login', methods=["POST"])
def login():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data:
        return bad_request("Invalid input!")
    email = data["email"].strip().lower()
    verification_code = data["verification_code"]
.filter_by(email).first()
    response, code_status = user.is_valid_code(verification_code)
    if code_status == 200:
        access_token, refresh_token = create_jwt_tokens(user.id)
        return {'access_token':access_token,
                'refresh_token':refresh_token
                }, code_status
    
    return response, code_status


def create_jwt_tokens(user_id):
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token
