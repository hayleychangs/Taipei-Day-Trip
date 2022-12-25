from flask import *
import json
import jwt
from model.booking_model import new_booking, get_booking_info, delete_booking
from data import settings
from route.member import verify_jwt_token


booking_api=Blueprint("booking_api",
                        __name__,
                        static_folder="static",
                        static_url_path="/static",
)

@booking_api.route("/api/booking", methods=["GET", "POST", "DELETE"])
def api_booking():
    try:
        token=request.cookies.get("token")
        if token is not None:
            signin_check_result=verify_jwt_token(token)
            member_id=signin_check_result["id"]
            if signin_check_result!=False:
                if request.method=="GET":
                    result=get_booking_info(member_id)
                    response=make_response(jsonify({"data":result}))
                    return response
                elif request.method=="POST":
                    request_data=request.get_json()
                    attraction_id=request_data["attractionId"]
                    date=request_data["date"]
                    time=request_data["time"]
                    price=request_data["price"]
                    booking_result=new_booking(member_id, attraction_id, date, time, price)
                    if booking_result==True:
                        response=make_response(jsonify({"ok":booking_result}))
                        return response
                    else:
                        booking_failed=True
                        booking_failed_msg="booking failed."
                        error_response=make_response(jsonify({"error":booking_failed, "message":booking_failed_msg}), 400)
                        return error_response
                else:
                    delete_result=delete_booking(member_id)
                    if delete_result==True:
                        booking_deleted=True
                        response=make_response(jsonify({"ok":booking_deleted}))
                        return response
                    else:
                        booking_deleted=False
                        response=make_response(jsonify({"ok":booking_deleted}))
                        return response
        else:
            signin_error=True
            signin_message="Please signin again!"
            response=make_response(jsonify({"error":signin_error, "message":signin_message}), 403)
            return response
    except:
        unexpected_error=True
        unexpected_error_msg="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
        error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_msg}), 500)
        return error_response