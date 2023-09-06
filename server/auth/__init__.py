from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('auth', __name__)
CORS(bp, origins=["http://localhost:5173"], supports_credentials=True)
from server.auth import routes