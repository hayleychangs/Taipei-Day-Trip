import urllib.request as request
import json
import mysql.connector
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



with open("taipei-attractions.json", "r", encoding="utf8") as file:
    data=json.load(file)

attractions_list=data["result"]["results"]

for infos in attractions_list:
    images_file=infos["file"].split("http")
    result=[]   #""
    for images in images_file:
        if images[-3:] in ["jpg","JPG","PNG","png"]:
            url="http"+images
            result.append(url)
    result=json.dumps(result) #json格式
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