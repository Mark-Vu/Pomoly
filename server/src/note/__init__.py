from flask import Blueprint

bp = Blueprint("note", __name__)

from . import routes