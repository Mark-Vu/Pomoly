from server.api import bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.models import User
from server.models import Calendar
from server import db

@bp.route("/api/user-profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    response = {
        "message":"ok",
        "user_id": user.id,
        "email": user.email,
        "name":user.name
    }
    return response, 200