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

def new_booking(member_id, attraction_id, date, time, price):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()       
        sql_check="SELECT member_id FROM booking WHERE member_id =%s"
        val_check=(member_id,)
        mycursor.execute(sql_check, val_check)
        result=mycursor.fetchone()
        if result==None:
            sql="INSERT INTO booking (member_id, attraction_id, date, time, price) VALUES (%s, %s, %s, %s, %s)"
            val=(member_id, attraction_id, date, time, price)
            mycursor.execute(sql, val)
            cnx.commit()
            return True
        else:
            sql_update="UPDATE booking SET attraction_id=%s, date=%s, time=%s, price=%s WHERE member_id=%s"
            val_update=(attraction_id, date, time, price, member_id)
            mycursor.execute(sql_update, val_update)
            cnx.commit()
            return True         
    except:
        print("Unexpected Error from new_booking()")
        return False
    finally:
        mycursor.close()
        cnx.close()
        
def get_booking_info(member_id):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor(dictionary=True)
        
        sql_booking="SELECT attraction_id, date, time, price FROM booking WHERE member_id =%s"                                                          
        val_booking=(member_id,)
        mycursor.execute(sql_booking, val_booking)
        booking_result=mycursor.fetchone()  #如果要能訂多個行程改fetchall
        if booking_result==None:
            booking_info=None
            return booking_info
        else:
            attraction_id=booking_result["attraction_id"]
            booking_date=booking_result["date"].strftime("%Y-%m-%d")
            booking_time=booking_result["time"]
            booking_price=booking_result["price"]     
            sql_attraction="SELECT name, address, images FROM attractions WHERE attraction_id =%s"
            val_attraction=(attraction_id,)
            mycursor.execute(sql_attraction, val_attraction)
            attraction_result=mycursor.fetchone()
            attraction_name=attraction_result["name"]
            attraction_address=attraction_result["address"]
            image=attraction_result["images"]
            image=json.loads(image)
            attraction_image=image[0]   
            booking_info={
                "attraction":{
                    "id":attraction_id,
                    "name":attraction_name,
                    "address":attraction_address,
                    "image":attraction_image,
                },
                "date": booking_date,
                "time": booking_time,
                "price":booking_price
            }
            return booking_info
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()

def delete_booking(member_id):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        sql="DELETE FROM booking WHERE member_id= %s"
        val=(member_id,)
        mycursor.execute(sql, val)
        cnx.commit()
        return True
    except:
        print("Unexpected Error from delete_booking()")
        return False
    finally:
        mycursor.close()
        cnx.close()