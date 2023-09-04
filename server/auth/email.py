from itsdangerous import URLSafeTimedSerializer
from flask import current_app
from server.email import send_email

def generate_verification_code(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])

def confirm_verification_code(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,  # Use the last 8 characters for verification
            salt=current_app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email

def send_verification_email(user_email, verification_code):
    subject = "Verify your email"
    sender = current_app.config["MAIL_DEFAULT_SENDER"]  # Update with your email address
    recipients = [user_email]
    text_body = f"Your verification code is: {verification_code}"
    send_email(subject=subject,
               sender=sender,
               recipients=recipients,
               text_body=text_body)
    