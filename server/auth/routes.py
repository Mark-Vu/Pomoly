from . import bp
from flask import request, jsonify
from server.models import User, VerificationCode
from server.api.errors import bad_request
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity,
    create_refresh_token, set_access_cookies, set_refresh_cookies
        )
from server import db
from server.auth.email import send_verification_email
import re


@bp.route('/users/auth/email', methods=["POST"])
def enter_email():
    data = request.get_json()

    if "email" not in data or not is_email_format(data["email"]):
        return bad_request("Invalid input!")

    email = data["email"].lower().strip()
    user = User.query.filter_by(email=email).first()

    if user is None or user.name is None:
        # If there is an account with no name or can't find any account in the database
        if user is None:
            new_user = User(email=email)
            db.session.add(new_user)
            db.session.commit()
            send_verification_email(email, new_user.verification_code.code)

        return {"message": "Please verify your email to register"}, 202

    # If there is an account with a name
    send_verification_email(email, user.verification_code.code)
    return {"message": "Please verify your email to login your account"}, 200


@bp.route('/users/auth/register', methods=["POST"])
def register():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data or "name" not in data or not is_email_format(data["email"]):
        return bad_request("Invalid input!")

    input_email = data["email"]
    verification_code = data["verification_code"]

    # Find the user associated with the email
    user = User.query.filter_by(email=input_email).first_or_404()

    # Find the associated verification code
    verification = VerificationCode.query.filter_by(user_id=user.id).first()

    if verification.confirm_verification_code(verification_code) == "incorrect":
        return bad_request("The confirmation code is incorrect")
    elif verification.confirm_verification_code(verification_code) == "expired":
        return bad_request("Your confirmation code has expired")

    # Update the user's name
    user.name = data["name"]
    db.session.commit()

    # Create access and refresh tokens
    resp = jsonify({'message': 'ok'})
    access_token, refresh_token = create_jwt_tokens(user.id)
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@bp.route('/users/auth/login', methods=["POST"])
def login():
    data = request.get_json()
    if "email" not in data or not is_email_format(data["email"]) or "verification_code" not in data:
        return bad_request("Invalid input!")

    # Find the user associated with the email
    user = User.query.filter_by(email=input_email).first_or_404()
    # Find the associated verification code
    verification = VerificationCode.query.filter_by(user_id=user.id).first()

    if verification is not None:
        verification.set_new_code()
    else:
        # If no verification code exists, create a new one and associate it with the user.
        new_verification = VerificationCode()
        new_verification.user = user
        db.session.add(new_verification)

    if verification.confirm_verification_code(verification_code) == "invalid":
        return bad_request("The confirmation code is invalid")
    elif verification.confirm_verification_code(verification_code) == "expired":
        return bad_request("Your confirmation code has expired")

    user = User.query.filter_by(email=email).first_or_404()
    # Creat access and refresh_token
    resp = jsonify({'message': 'ok'})
    access_token, refresh_token = create_jwt_tokens(user.id)
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@bp.route('/users/auth/verification-code/resend', methods=["POST"])
def resend_verification_code():
    # Get the user's email from the request data
    data = request.get_json()
    if "email" not in data or not is_email_format(data["email"]):
        return bad_request("Invalid input!")

    email = data["email"].lower().strip()

    user = User.query.filter_by(email=email).first_or_404()
    user.verification_code.set_new_code()
    send_verification_email(email, user.verification_code.code)

    db.session.commit()

    return {"message": "Verification code resent successfully"}, 200



@bp.route("/users/auth/token-refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    # We are using the `refresh=True` options in jwt_required to only allow
    # refresh tokens to access this route.
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    resp = jsonify({'message': 'ok'})
    set_access_cookies(resp, access_token)
    return resp, 200


def create_jwt_tokens(user_id):
    # With JWT_COOKIE_CSRF_PROTECT set to True, set_access_cookies() and
    # set_refresh_cookies() will now also set the non-httponly CSRF cookies
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token


def save_new_user(new_user):
    db.session.add(new_user)
    db.session.commit()


def is_email_format(input_email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, input_email)