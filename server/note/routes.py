from . import bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, Note
from server import db
from server.api.errors import bad_request
from flask import request, jsonify


@bp.route("/note" , methods=["GET"])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    notes_list = Note.query.filter_by(user_id=user_id).all()
    note_data = []
    for note in notes_list:
        formattedDate = note.date.strftime('%B %d, %Y')
        formattedTime = note.last_modified_time.strftime('%H:%M')
        note_data.append(
            {
                "id": note.id,
                "date": formattedDate, 
                "title": note.title,
                "content": note.content,
                "last_modified_date": formattedDate,
                "last_modified_time": formattedTime
            }
        )
    
    return note_data, 200


@bp.route("/note", methods=["PUT"])
@jwt_required()
def add_note():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Create a new Note object
    new_note = Note(
        user_id=user_id,
        title=data.get("title"),
        content=data.get("content"),
        date=data.get("date"),  
        last_modified_date=data.get("last_modified_date"),
        last_modified_time=data.get("last_modified_time")
    )   
    

    db.session.add(new_note)
    db.session.commit()
    resp = {
        "message":"Note added successfully",
        "note_id":new_note.id
    }
    return jsonify(resp), 201


@bp.route("/note/<note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    # If note not found or does not belong to user
    if note is None:
        return jsonify({"message": "Note not found"}), 404
    
    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted successfully"}), 200