import urllib.request as request
import json
import mysql.connector
from mySQL import MySQLPassword

dbconfig={
    "host":"localhost",
    "port":"3306",
    "database":"taipei_day_trip",
    "user":"eureka",
    "password":MySQLPassword(),
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 10,
                                                      pool_reset_session = True,
                                                      **dbconfig)



with open("taipei-attractions.json", "r", encoding="utf8") as file:
    data=json.load(file)

attractions_list=data["result"]["results"]

for infos in attractions_list:
    images_file=infos["file"].split("http")
    result=""
    for images in images_file:
        if images[-3:] in ["jpg","JPG","PNG","png"]:
            result+="http"+images+","
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        sql="INSERT INTO attractions (attraction_id, name, category, description, address, transport, mrt, lat, lng, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val=(infos["_id"], infos["name"], infos["CAT"], infos["description"], infos["address"], infos["direction"], infos["MRT"], infos["latitude"], infos["longitude"], result)
        mycursor.execute(sql, val)
        cnx.commit()
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()