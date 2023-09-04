from . import bp
from flask import request
from server.models import User
from server.api.errors import bad_request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity;
from flask_jwt_extended import create_refresh_token;
from server import db;
from server.auth.email import generate_verification_code, confirm_verification_code, send_verification_email


@bp.route('/users/getinfo', methods=['GET'])
def test():
    return {"message:":"success"}


@bp.route('/users/auth/email', methods=["POST"])
def enter_email():
    data = request.get_json()
    if "email" not in data:
        return bad_request("Invalid input!")
    email = data["email"].lower().strip()
    user = User.query.filter_by(email=email).first()

    # Send email verification
    verification_code = generate_verification_code(email)
    send_verification_email(email, verification_code)

    if user is None or user.name is None:
        # If there is an account with no name
        # OR cant find any account in db
        if user is None:
            new_user = User(email=email)
            save_new_user(new_user)

        return {"message": "Please verify your email to register"}, 202
    # If there is an account with a name

    return {"message": "Please verify your email"}, 200


@bp.route('/users/auth/register', methods=["POST"])
def register():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data or "name" not in data:
        return bad_request("Invalid input!")
    verification_code = data["verification_code"]
    input_email = data["email"]
    try:
        email = confirm_verification_code(verification_code)
    except:
        return bad_request("The confirmation link is invalid or has expired")
    if email != input_email:
        return bad_request("The confirmation link is invalid or has expired")
    user = User.query.filter_by(email=email).first_or_404()
    user.name = data["name"]
    db.session.commit()
    access_token, refresh_token = create_jwt_tokens(user.id)
    return {'access_token':access_token,
            'refresh_token':refresh_token
            }, 200


@bp.route('/users/auth/login', methods=["POST"])
def login():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data:
        return bad_request("Invalid input!")
    verification_code = data["verification_code"]
    try:
        email = confirm_verification_code(verification_code)
    except:
        return bad_request("The confirmation link is invalid or has expired")
    user = User.query.filter_by(email=email).first_or_404()
    access_token, refresh_token = create_jwt_tokens(user.id)
    return {'access_token':access_token,
            'refresh_token':refresh_token
            }, 200


# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return {"access_token":access_token}


def create_jwt_tokens(user_id):
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token


def save_new_user(new_user):
    db.session.add(new_user)
    db.session.commit()