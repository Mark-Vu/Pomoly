from threading import Thread
from flask import current_app
from flask_mail import Message
from src import mail
import asyncio

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


async def send_email(subject, sender, recipients, text_body, attachments=None, sync=False, production=False):
    if production:
        msg = Message('Pomoly: Verify your account', recipients=recipients)
        msg.body = text_body
        msg.html = f'<p>{text_body}</p>'
        mail.send(msg)
    else:
        try:
            msg = Message(subject, sender=sender, recipients=recipients)
        except:
            print("Email credentials not accepted")
        msg.body = text_body
        if attachments:
            for attachment in attachments:
                msg.attach(*attachment)
        if sync:
            mail.send(msg)
        else:
            Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()