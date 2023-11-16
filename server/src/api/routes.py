from src.api import bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.models import User
from src.models import Calendar
from src import db

@bp.route("/api/user-profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    response = {
        "email": user.email,
        "name":user.name
    }
    return response, 200