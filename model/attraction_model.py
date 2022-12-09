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

def get_categories():
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        sql="SELECT category FROM attractions"
        mycursor.execute(sql)
        result=mycursor.fetchall()
        result_list=[]
        for categories in result:
            result_list.append(categories[0])
        categories_list=list(set(result_list))  #set: to remove duplicated list
        return jsonify({"data":categories_list})
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()
        
def get_attraction_by_id(attractionId):
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor()
        sql="SELECT attraction_id, name, category, description, address, transport, mrt, lat, lng, images FROM attractions WHERE attraction_id =%s"
        val=(attractionId,)
        mycursor.execute(sql, val)
        result=mycursor.fetchone()
        if result==None:
            attraction_infos=None
            return jsonify({"data":attraction_infos})
        else:
            attraction_infos={
                "id":result[0],
                "name":result[1],
                "category":result[2],
                "description":result[3],
                "address":result[4],
                "transport":result[5],
                "mrt":result[6],
                "lat":result[7],
                "lng":result[8],
                "images":json.loads(result[9])
            }
            return jsonify({"data":attraction_infos})
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()
        
def get_attractions(pagenumber):
    pagenumber=int(pagenumber)
    start_index=pagenumber*12
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor(dictionary=True)  
        
        sql_count="SELECT COUNT(table_id) FROM attractions"
        mycursor.execute(sql_count)
        count_result=mycursor.fetchone()
        data_length=count_result["COUNT(table_id)"]
        
        sql="SELECT attraction_id, name, category, description, address, transport, mrt, lat, lng, images FROM attractions order by table_id limit %s, %s"
        val=(start_index, 12)
        mycursor.execute(sql, val)
        data=mycursor.fetchall()
        
        result=[]
        
        for each_data in data:
            each_data["images"]=json.loads(each_data["images"])  #turn to dic then..jsonify again
            result.append({
                "id":each_data["attraction_id"],
                "name":each_data["name"],
                "category":each_data["category"],
                "description":each_data["description"],
                "address":each_data["address"],
                "transport":each_data["transport"],
                "mrt":each_data["mrt"],
                "lat":each_data["lat"],
                "lng":each_data["lng"],
                "images":each_data["images"]
            })
        
        if data==None:
            attractions_infos=None
            return jsonify({"data":attractions_infos})
        else:
            if pagenumber==0:
                next_page=1
            elif pagenumber<data_length//12:
                next_page=pagenumber+1
            else:
                next_page=None
            return jsonify({"data":result, "nextPage":next_page})
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()

def get_attractions_keyword_filtered(pagenumber, keyword): #both like & locate can't use index, query speed depending on the first occurrence of the substring
    pagenumber=int(pagenumber)
    start_index=pagenumber*12
    try:
        cnx=cnxpool.get_connection()
        mycursor=cnx.cursor(dictionary=True)
            
        sql_count="SELECT COUNT(table_id) FROM attractions WHERE category=%s OR LOCATE(%s, name)>0"
        val_count=(keyword, keyword)
        mycursor.execute(sql_count, val_count)
        count_result=mycursor.fetchone()
        data_length=count_result["COUNT(table_id)"]
        
        sql="SELECT attraction_id, name, category, description, address, transport, mrt, lat, lng, images FROM attractions WHERE category=%s OR LOCATE(%s, name)>0 limit %s, %s"
        val=(keyword, keyword, start_index, 12)
        mycursor.execute(sql, val)
        data=mycursor.fetchall()
        
        result=[]
        
        for each_data in data:
            each_data["images"]=json.loads(each_data["images"])  #turn to dic then..jsonify again
            result.append({
                "id":each_data["attraction_id"],
                "name":each_data["name"],
                "category":each_data["category"],
                "description":each_data["description"],
                "address":each_data["address"],
                "transport":each_data["transport"],
                "mrt":each_data["mrt"],
                "lat":each_data["lat"],
                "lng":each_data["lng"],
                "images":each_data["images"]
            })
            
        if data==None:
            attractions_infos=None
            return jsonify({"data":attractions_infos})
        else:
            if data_length<12:
                    next_page=None
            elif data_length-((pagenumber+1)*12)>0:
                next_page=pagenumber+1
            else:
                next_page=None
            return jsonify({"data":result, "nextPage":next_page})
    except:
        print("Unexpected Error")
    finally:
        mycursor.close()
        cnx.close()