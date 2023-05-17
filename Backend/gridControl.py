from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId 
from flask_cors import CORS 
# import yaml 

app=Flask(__name__)
# config=yaml.load(open('database.yaml'))mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
client=MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=/GridData")
db=client['GridData']

CORS(app)

@app.route('/data')
def gridData():
    data=db['Grid'].find()
    dataJson=[]
    for d in data:
        athlete= d['athlete']
        year= d['year']
        obj={
            'id': str(d['_id']),
            'athlete': athlete,
            'year':year
        }
        dataJson.append(obj)
    return jsonify(dataJson)

@app.route('/updatedData')
def updateData():
    data=request.json()
    athlete= data[athlete]
    year=data[year]
    db['Grid'].update_one({})

if __name__=='__main__':
    app.run(debug=True, port=8001)