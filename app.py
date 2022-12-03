from flask import jsonify, Flask,  request, render_template, redirect, session, url_for, jsonify, make_response, Blueprint
from flask_cors import CORS
from view.attraction import attraction_api

app=Flask(
    __name__,
    static_folder="static",
    static_url_path="/static",
)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

CORS(app)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.register_blueprint(attraction_api)

if __name__=="__main__":
	app.run(port=3000)	#host='0.0.0.0',