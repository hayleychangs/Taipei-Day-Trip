import mysql.connector
import json
from datetime import datetime
from flask import jsonify
from data import settings

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 10,
                                                      pool_reset_session = True,
                                                      host=settings.host,
                                                      port=settings.port,
                                                      database=settings.database,
                                                      user=settings.user,
                                                      password=settings.password
                                                      )



def new_order(member_id, attraction_id, date, time, price, attraction_address, attraction_image_url, contact_name, contact_email, contact_phone_number, order_number, bank_transaction_id, payment_status):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()    
           
        sql="INSERT INTO order_info (member_id, attraction_id, date, time, price, attraction_address, attraction_image_url, contact_name, contact_email, contact_phone_number, order_number, bank_transaction_id, payment_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val=(member_id, attraction_id, date, time, price, attraction_address, attraction_image_url, contact_name, contact_email, contact_phone_number, order_number, bank_transaction_id, payment_status)
        mycursor.execute(sql, val)
        cnx.commit()
        return True   
    except:
        print("Unexpected Error from new_order()")
        return False
    finally:
        mycursor.close()
        cnx.close()

#更新付款狀態
def update_payment_status(payment_status, order_number):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        
        sql_update="UPDATE order_info SET payment_status=%s WHERE order_number=%s"
        val_update=(payment_status, order_number)
        mycursor.execute(sql_update, val_update)
        cnx.commit()
        return True
    except:
        print("Unexpected Error from update_payment_status()")
        return False
    finally:
        mycursor.close()
        cnx.close()
        
#紀錄付款資訊
def save_payment_info(order_number, status_code, status_msg, rec_trade_id, currency, amount, transaction_time_millis):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()    
           
        sql="INSERT INTO payment_info (order_number, status_code, status_msg, rec_trade_id, currency, amount, transaction_time_millis) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val=(order_number, status_code, status_msg, rec_trade_id, currency, amount, transaction_time_millis)
        mycursor.execute(sql, val)
        cnx.commit()
        return True   
    except:
        print("Unexpected Error from new_order()")
        return False
    finally:
        mycursor.close()
        cnx.close()

#查詢訂單資料
def get_order(orderNumber, member_id):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor(dictionary=True)
        sql_order="SELECT order_info.order_number, order_info.price, order_info.attraction_id, attractions.name, order_info.attraction_address, order_info.attraction_image_url, order_info.date, order_info.time, order_info.contact_name, order_info.contact_email, order_info.contact_phone_number, payment_info.status_code FROM (order_info INNER JOIN attractions ON order_info.attraction_id=attractions.attraction_id AND order_info.order_number =%s AND order_info.member_id =%s) INNER JOIN payment_info ON order_info.order_number=payment_info.order_number"
        val_order=(orderNumber, member_id)
        mycursor.execute(sql_order, val_order)
        order_result=mycursor.fetchone() #可能有多筆已付款資料及多筆未付款資料
        if order_result==None:
            order_info=None
            return order_info
        else:
            order_number=order_result["order_number"]
            order_price=order_result["price"]
            order_attraction_id=order_result["attraction_id"]
            order_attraction_name=order_result["name"]
            order_attraction_address=order_result["attraction_address"]
            order_attraction_img=order_result["attraction_image_url"]           
            order_date=order_result["date"].strftime("%Y-%m-%d")
            order_time=order_result["time"]
            order_contact_name=order_result["contact_name"]
            order_contact_email=order_result["contact_email"]
            order_contact_phone_number=order_result["contact_phone_number"]
            order_status_code=order_result["status_code"]

            order_info={
                "number": order_number,
                "price": order_price,
                "trip": {
                    "attraction": {
                        "id": order_attraction_id,
                        "name": order_attraction_name,
                        "address": order_attraction_address,
                        "image": order_attraction_img
                    },
                    "date": order_date,
                    "time": order_time,
                },
                "contact": {
                    "name": order_contact_name,
                    "email": order_contact_email,
                    "phone": order_contact_phone_number
                },
                "status": order_status_code
                
            }
            return order_info
            
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()
