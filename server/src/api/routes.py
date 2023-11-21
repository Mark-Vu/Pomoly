from src.api import bp


@bp.route("/", methods=["GET"])
def welcome():
    return "<h1>Welcome to StudyHub</h1>"