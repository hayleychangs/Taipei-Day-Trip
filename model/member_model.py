import mysql.connector
import json
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

def check_email(email):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()  
        sql="SELECT email FROM member WHERE email=%s"
        val=(email)
        mycursor.execute(sql, (val,))
        result=mycursor.fetchall()
        return result
    except:
        print("Unexpected Error from check_email()")
    finally:
        mycursor.close()
        cnx.close()

def insert_signupinfo(name, email, password):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor() 
        sql="INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
        val=(name, email, password)
        mycursor.execute(sql, val)
        cnx.commit()
        return True
    except:
        print("Unexpected Error from insert_signupinfo()")
        return False
    finally:
        mycursor.close()
        cnx.close()

def check_signin(email):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        sql="SELECT * FROM member WHERE email =%s"
        val=(email)
        mycursor.execute(sql, (val,))
        result=mycursor.fetchone()
        return result
    except:
        print("Unexpected Error from check_signin()")
    finally:
        mycursor.close()
        cnx.close()