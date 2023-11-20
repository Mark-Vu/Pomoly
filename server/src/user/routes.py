from src.user import bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models import User


@bp.route("/users/info", methods=["GET"])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    response = {
        "email": user.email,
        "name":user.name
    }
    return response, 200
