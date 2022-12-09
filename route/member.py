from flask import *
# from model.member_model import 會員資料庫函式
import json
import jwt
from model.member_model import check_email, insert_signupinfo, check_signin
from data import settings

member_api=Blueprint("member_api",
                         __name__,
                        static_folder="static",
                        static_url_path="/static",
)

@member_api.route("/api/user", methods=["POST"])
def api_user():
    if request.method=="POST":
        print("進入程序")
        request_data=request.get_json()
        print(request_data)
        try:
            request_data=request.get_json()
            print(request_data)
            new_name=request_data["name"]
            email_check=request_data["email"]
            new_password=request_data["password"]
            email_check_result=check_email(email_check)
            if email_check_result==[] and new_name!="" and email_check!="" and new_password!="":
                insert_result=insert_signupinfo(new_name, email_check, new_password)
                print(insert_result)
                if insert_result==True:
                    response=make_response(jsonify({"ok":insert_result}))
                    return response
                else:
                    signup_failed=True
                    signup_failed_msg="Signup failed."
                    error_response=make_response(jsonify({"error":signup_failed, "message":signup_failed_msg}), 400)
                    return error_response
            else:
                 email_db=email_check_result[0][0]
                 print(email_db)
                 if email_db==email_check:
                    email_registered=True
                    email_registered_msg="Email already exists."
                    response=make_response(jsonify({"error":email_registered, "message":email_registered_msg}), 400)
                    return response                   
        except:
            unexpected_error=True
            unexpected_error_msg="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
            error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_msg}), 500)
            return error_response

@member_api.route("/api/user/auth", methods=["GET", "PUT", "DELETE"])
def api_user_auth():
    if request.method=="PUT":
        try:
            request_data=request.get_json()
            email_input=request_data["email"]
            password_input=request_data["password"]
            signin_check_result=check_signin(email_input)          
            if email_input=="" or password_input=="":
                signin_failed=True
                signin_failed_msg="Incorrect email or password."
                error_response=make_response(jsonify({"error":signin_failed, "message":signin_failed_msg}), 400)
                return error_response
            
            if signin_check_result is None:
                signin_failed=True
                signin_failed_msg="Email unknown."
                error_response=make_response(jsonify({"error":signin_failed, "message":signin_failed_msg}), 400)
                return error_response
            else:
                id_db=signin_check_result[0]
                name_db=signin_check_result[1]
                email_db=signin_check_result[2]
                password_db=signin_check_result[3]
                if email_input==email_db and password_input==password_db:
                    signin_ok=True
                    encoded_jwt=jwt.encode({"id":id_db, "name":name_db, "email":email_db}, settings.secretkey, algorithm="HS256")
                    response=make_response(jsonify({"ok":signin_ok}))
                    response.set_cookie(key="token", value=encoded_jwt, max_age=604800, httponly=True) 
                    return response
                else:
                    signin_error=True
                    signin_error_msg="Incorrect password."
                    error_response=make_response(jsonify({"error":signin_error, "message":signin_error_msg}), 400)
                    return error_response
        except:
            unexpected_error=True
            unexpected_error_msg="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
            error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_msg}), 500)
            return error_response
    elif request.method=="GET":
        try:
            token=request.cookies.get("token")
            if token is not None:
                result=verify_jwt_token(token)
                response=make_response(jsonify({"data":result}))
                return response
            else:
                #Please sign in again!
                signin_status=None
                response=make_response(jsonify({"data":signin_status}))
                return response
        except:
            unexpected_error=True
            unexpected_error_msg="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
            error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_msg}), 500)
            return error_response
    else :
        try:
            signout_status=True
            response=make_response(jsonify({"ok":signout_status}))
            response.set_cookie(key="token", value="", max_age=-1, httponly=True)
            return response
        except:
            unexpected_error=True
            unexpected_error_msg="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
            error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_msg}), 500)
            return error_response
            

            
def verify_jwt_token(token):
    try:
        signin_info=jwt.decode(token, settings.secretkey, algorithms=["HS256"])
        return signin_info    
    except jwt.PyJWTError:
        print("token解碼失敗")
        return False        
       
            
                    
                    


             
