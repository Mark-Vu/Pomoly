import secrets
from datetime import datetime, timedelta
from . import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=True)
    verification_code = db.Column(db.String())
    verification_code_expiration = db.Column(db.DateTime)

    def __init__(self, email, name):
        self.email = email
        self.name = name
        self.generate_verification_code()

    def generate_verification_code(self):
        code = secrets.token_urlsafe(6)
        self.verification_code = code
        # Create expiry time for the code after 30 mins
        self.verification_code_expiration = datetime.utcnow() + timedelta(minutes=30)

    def is_valid_code(self, code):
        if self.verification_code.lower() == code.lower():
            if datetime.utcnow() > self.verification_code_expiration:
                return {"message": "Verification code has expired."}, 401  # Unauthorized (Expired)
            else:
                return {"message":"success"}, 200  # OK (Valid)
        return {"message":"Incorrect verification code."}, 403  # Forbidden (Incorrect code)
    