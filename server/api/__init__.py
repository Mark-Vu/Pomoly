from flask import Blueprint

bp = Blueprint("api", __name__)

from server.api import routes