from flask import Blueprint

bp = Blueprint("user",__name__)

from src.user import routes