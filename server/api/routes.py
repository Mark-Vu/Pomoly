from server.api import bp
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.models import User


@bp.route("/users/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    response = f'Welcome {user.name}'
    return {"message": response}, 200