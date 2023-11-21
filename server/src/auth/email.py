from flask import current_app
from src.email import send_email
import os
from dotenv import load_dotenv
import asyncio
load_dotenv()

async def send_verification_email(user_email, verification_code):
    subject = "Verify your email"
    sender = current_app.config["MAIL_DEFAULT_SENDER"]  # Update with your email address
    recipients = [user_email]
    text_body = f"Your verification code is: {verification_code}"
    production=False if os.environ['PRODUCTION'] == "false" else True
    send_email(subject=subject, sender=sender, recipients=recipients, text_body=text_body, production=production)
    