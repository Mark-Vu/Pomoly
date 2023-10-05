from . import bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import User, Calendar, Event
from server import db
from server.api.errors import bad_request
from flask import request

@bp.route("/calendar/info", methods=["GET"])
@jwt_required()
def get_user_calendar():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    
    # Initialize an empty dictionary to store the calendar events.
    calendar_events = {}
    for event in user.calendar.events:
        # Iterate through the user's calendar events and organize them by date.
        date_str = event.date.strftime('%Y-%m-%d')
        if date_str not in calendar_events:
            calendar_events[date_str] = []
        calendar_events[date_str].append({
            "title": event.title,
            "time": event.time,
            "id": event.id
        })
    return calendar_events, 200


@bp.route("/calendar/add-event", methods=["POST"])
@jwt_required()
def add_event():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if user:
        calendar_id = user.calendar.id
        data = request.get_json()
        event_title = data.get("title")
        event_date = data.get("date")
        event_time = data.get("time")
        try:
            new_event = Event(calendar_id=calendar_id, 
                              title=event_title, 
                              date=event_date, 
                              time=event_time)
            user.calendar.events.append(new_event)
            db.session.commit()
            
            return {"message": "Event added successfully"}, 200
        except Exception as e:
            return {"message": "There is an error while adding event"}, 500  
    else:
        return bad_request("bad request!")
