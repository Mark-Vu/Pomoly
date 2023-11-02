from flask import current_app
from server.email import send_email



def send_verification_email(user_email, verification_code):
    subject = "Verify your email"
    sender = current_app.config["MAIL_DEFAULT_SENDER"]  # Update with your email address
    recipients = [user_email]
    text_body = f"Your verification code is: {verification_code}"
    send_email(subject=subject, sender=sender, recipients=recipients, text_body=text_body)
    