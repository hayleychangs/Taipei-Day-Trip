from flask import jsonify, Flask,  request, render_template, redirect, session, url_for, jsonify, make_response, Blueprint
from model.attraction_model import get_categories, get_attraction_by_id, get_attractions, get_attractions_keyword_filtered
import json

attraction_api=Blueprint("attraction_api",
                         __name__,
                        static_folder="static",
                        static_url_path="/static",
)

@attraction_api.route("/api/attractions", methods=["GET"])
def api_attractions():
	pagenumber_input=request.args.get("page" ,"0")
	keyword_input=request.args.get("keyword","")
	if request.method=="GET":
		try:
			if pagenumber_input=="":
				error=True
				error_message="請輸入頁碼"
				response=make_response(jsonify({"error":error, "message":error_message}), 400)
				return response
			elif keyword_input!="":
				response=get_attractions_keyword_filtered(pagenumber_input, keyword_input)
				return response
			else:
				response=get_attractions(pagenumber_input)
				return response
		except:
			unexpected_error=True
			unexpected_error_message="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
			error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_message}), 500)
			return error_response

@attraction_api.route("/api/attraction/<attractionId>", methods=["GET"]) #根據景點編號取得景點資料
def api_attraction_by_id(attractionId):
	if request.method=="GET":
		try:
			result=get_attraction_by_id(attractionId)
			get_result=json.loads(result.get_data().decode("utf-8"))
			data_db=get_result["data"]
			if data_db==None:
				error=True
				error_message="景點編號不正確"
				response=make_response(jsonify({"error":error, "message":error_message}), 400)
				return response
			else:
				response=get_attraction_by_id(attractionId)
				return response
		except:
			unexpected_error=True
			unexpected_error_message="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
			error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_message}), 500)
			return error_response

@attraction_api.route("/api/categories", methods=["GET"])	#取得景點分類名稱列表
def api_categories():
    try:
        response=get_categories()
        return response
    except:
        unexpected_error=True
        unexpected_error_message="Oops! Something went wrong. The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again or come back later."
        error_response=make_response(jsonify({"error":unexpected_error, "message":unexpected_error_message}), 500)
        return error_response