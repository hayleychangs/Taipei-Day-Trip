from flask import *
import json
import jwt
import requests
import re
from datetime import datetime
import time
from model.booking_model import get_booking_info, delete_booking
from model.order_model import new_order, update_payment_status, save_payment_info, get_order
from data import settings
from route.member import verify_jwt_token

order_api=Blueprint("order_api",
                        __name__,
                        static_folder="static",
                        static_url_path="/static",
)

@order_api.route("/api/orders", methods=["POST"])
def api_orders():
    try:
        token=request.cookies.get("token")
        if token is not None:
            signin_check_result=verify_jwt_token(token)
            member_id=signin_check_result["id"]
            if signin_check_result!=False:
                
                request_data=request.get_json()
                
                prime=request_data["prime"]
                contact_name=request_data["order"]["contact"]["name"]
                contact_email=request_data["order"]["contact"]["email"]
                contact_phone_number=request_data["order"]["contact"]["phone"]
                    
                email_check_result=email_check(contact_email)
                    
                if contact_name=="" or contact_email=="" or contact_phone_number=="":
                    order_error=True
                    error_msg="Please fill out all required fields(name, email, phone number)."
                    response=make_response(jsonify({"error":order_error, "message":error_msg}), 400)
                    return response
                elif not contact_name.isalnum() or email_check_result==False or not contact_phone_number.isnumeric():
                    order_error=True
                    error_msg="Please make sure all fields(name, email, phone number) are filled in correctly."
                    response=make_response(jsonify({"error":order_error, "message":error_msg}), 400)
                    return response
                else:
                    result=get_booking_info(member_id)
                    price=result["price"]
                    attraction_id=result["attraction"]["id"]
                    attraction_img=result["attraction"]["image"]
                    attraction_address=result["attraction"]["address"]
                    date=result["date"]
                    time=result["time"]
                                            
                    payment_status="未付款"
                               
                    order_number=create_order_number(member_id)
                    bank_transaction_id=create_bank_transaction_id()
                        
                    #create order
                    create_order_result=new_order(member_id, attraction_id, date, time, price, attraction_address, attraction_img, contact_name, contact_email, contact_phone_number, order_number, bank_transaction_id, payment_status)
                      
                    if create_order_result==True:
                        #訂單成立後刪除booking資料
                        delete_booking(member_id)
                           
                        # pay by Prime API
                            
                        #partner_key
                        partner_key=settings.partner_key

                        #API網址 (測試環境)
                        api_url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                            
                        #header&pay_info
                        header={
                            "Content-Type": "application/json",
                            "x-api-key": partner_key
                        }
                        pay_info=json.dumps({
                            "prime": prime,
                            "partner_key": partner_key,
                            "merchant_id": "Hayley_TAISHIN",
                            "amount": int(price),
                            "order_number": order_number,
                            "bank_transaction_id": bank_transaction_id,
                            "details": "taipei_day_trip",
                            "cardholder":{
                                "phone_number": contact_phone_number,
                                "name": contact_name,
                                "email": contact_email,
                                "zip_code": "",
                                "address": "",
                                "national_id": "",
                                "member_id": member_id,
                            },
                            "product_image_url": attraction_img,
                        })
                            
                        #send request & get response
                        send_request=requests.post(api_url, data=pay_info, headers=header)

                        tappay_response=send_request.json()
                        status_code=tappay_response["status"]
                        status_msg=tappay_response["msg"]
                            
                        if status_code==0:
                            order_number=tappay_response["order_number"]
                            rec_trade_id=tappay_response["rec_trade_id"]
                            currency=tappay_response["currency"]
                            amount=tappay_response["amount"]
                            transaction_time_millis=tappay_response["transaction_time_millis"] 
                            payment_status="已付款"
                            #update pay status
                            update_payment_status(payment_status, order_number)
                            #紀錄付款資訊
                            save_payment_info(order_number, status_code, status_msg, rec_trade_id, currency, amount, transaction_time_millis)
                                
                            order_info={
                                    "number": order_number,
                                    "payment": {
                                        "status": status_code,
                                        "message": "付款成功"
                                    }
                            }
                            response=make_response(jsonify({"data":order_info}), 200)
                            return response
                        else:
                            rec_trade_id=""
                            currency=""
                            amount=""
                            transaction_time_millis=""
                            save_payment_info(order_number, status_code, status_msg, rec_trade_id, currency, amount, transaction_time_millis)
                                
                            order_info={
                                    "number": order_number,
                                    "payment": {
                                        "status": status_code,
                                        "message": "付款失敗"
                                    }
                            }
                            response=make_response(jsonify({"data":order_info}), 200)
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
        
@order_api.route("/api/order/<orderNumber>", methods=["GET"])
def api_order(orderNumber):
    try:
        token=request.cookies.get("token")
        if token is not None:
            signin_check_result=verify_jwt_token(token)
            member_id=signin_check_result["id"]
            if signin_check_result!=False:
                result=get_order(orderNumber, member_id)
                response=make_response(jsonify({"data":result}))
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


#產生訂單編號 
def create_order_number(member_id):
    prefix="TDT"+"-"+str(member_id)+"-"
    date=datetime.now().strftime("%Y%m%d")
    suffix=str(time.time()).replace(".","")[-7:]

    order_number=prefix+date+suffix

    return order_number

#產生bank id
def create_bank_transaction_id():
    prefix="BANK"
    num=str(time.time()).replace(".","")
    
    bank_id=prefix+num

    return bank_id

#email check
email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
def email_check(email):
    if(re.fullmatch(email_regex, email)):
        return True
    else:
        return False
    
    
#付款失敗者，重新付款:建立前先查詢order表，如果已有資料，則用舊的 寫一個getmodel
                    # order_check=get_order(member_id)
                    # print(order_check)
                    # order_attraction_id=order_check["attraction_id"]
                    # order_date=order_check["date"]
                    # order_time=order_check["time"]
                    # order_price=order_check["price"]

                    # print(order_attraction_id)
                    # print(order_date)
                    # print(order_time)
                    # print(order_price)
                        
                    # if order_check==None:
                    #     new_order() 放入所有參數
                    # elif order_attraction_id==attraction_id and order_date==date and order_time==time and order_price==price:
                    #     order_number=order_check["order_number"] 若預訂資料與訂單資料完全相等，則用訂單編號再次付款
                    # else:
                    #     若預訂資料稍有不同則建立新訂單
                    #     new_order()
                    # 若查有訂單，則檢查是否與新增訂單資料一樣
                    # 檢查項 order_number, attraction_id, date, time, price