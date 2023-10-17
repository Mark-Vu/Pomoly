from . import bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, Note
from server import db
from server.api.errors import bad_request
from flask import request, jsonify


@bp.route("/note/info" , methods=["GET"])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    notes_list = Note.query.filter_by(user_id=user_id).all()
    note_data = []
    for note in notes_list:
        note_data.append(
            {
                "id": note.id,
                "date": note.date, 
                "title": note.title,
                "content": note.content,
                "last_modified_date": note.last_modified_date,
                "last_modified_time": note.last_modified_time
            }
        )
    
    return jsonify(note_data), 200

# @bp.route("/note/add-note", methods=["POST"])
# @jwt_required
# def add_note():
#     pass