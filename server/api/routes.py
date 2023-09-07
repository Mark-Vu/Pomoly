from server.api import bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.models import User


@bp.route("/user-profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    response = {
        "user_id": user.id,
        "email": user.email,
        "name":user.name
    }
    return {"message": response}, 200


@bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    response = {
        # Will add notes and calendar data here
        "name":user.name
    }
    return {"message": response}, 200
