from . import bp
from flask import request, jsonify
from src.models import User, VerificationCode
from src.api.errors import bad_request
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity,
    create_refresh_token, set_access_cookies, set_refresh_cookies, 
    unset_jwt_cookies, get_csrf_token
        )
from src import db
from src.auth.email import send_verification_email
import re
import asyncio


@bp.route('/users/auth/email', methods=["POST"])
async def enter_email():
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
            await send_verification_email(email, new_user.verification_code.code)
        else:
            user.verification_code.set_new_code()
            await send_verification_email(email, user.verification_code.code)

        return {"message": "Please verify your email to register"}, 202

    # If there is an account with a name
    user.verification_code.set_new_code()
    await send_verification_email(email, user.verification_code.code)
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
    access_token, refresh_token = create_jwt_tokens(user.id)
    resp = jsonify({
        'access_csrf': get_csrf_token(access_token),
        'refresh_csrf': get_csrf_token(refresh_token)
    })
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@bp.route('/users/auth/login', methods=["POST"])
def login():
    data = request.get_json()
    if "email" not in data or "verification_code" not in data or not is_email_format(data["email"]):
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

    # Create access and refresh tokens\
    access_token, refresh_token = create_jwt_tokens(user.id)
    resp = jsonify({
        'access_csrf': get_csrf_token(access_token),
        'refresh_csrf': get_csrf_token(refresh_token)
    })

    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@bp.route('/users/auth/verification-code/resend', methods=["POST"])
async def resend_verification_code():
    # Get the user's email from the request data
    data = request.get_json()
    if "email" not in data or not is_email_format(data["email"]):
        return bad_request("Invalid input!")

    email = data["email"].lower().strip()

    user = User.query.filter_by(email=email).first_or_404()
    user.verification_code.set_new_code()
    await send_verification_email(email, user.verification_code.code)

    return {"message": "Verification code resent successfully"}, 200



@bp.route("/users/auth/token-refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """
    Endpoint to refresh JWT access tokens using a valid CSRF refresh token.

    Requires headers: {
        'X-CSRF-TOKEN': csrf_refresh_token (in local storage)
    }

    Returns 'csrf_access_token' in JSON response.
    Response Codes: 200 (Success), 401 (Unauthorized - Invalid/Expired refresh token).

    Usage: Call this endpoint with a valid refresh token to obtain a new access token.
    """

    # We are using the `refresh=True` options in jwt_required to only allow
    # refresh tokens to access this route.
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    resp = jsonify({
        'access_csrf': get_csrf_token(access_token)
    })
    set_access_cookies(resp, access_token)
    return resp, 200


@bp.route('/users/auth/logout', methods=['POST'])
def logout():
    # remove jwt in the cookie and logout user
    resp = jsonify({'logout': 'ok'})
    unset_jwt_cookies(resp)
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