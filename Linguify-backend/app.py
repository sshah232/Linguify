from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# MongoDB configuration
CONNECTION_STRING = os.getenv('MONGO_URI', "mongodb+srv://admin:BuildspaceS5@cluster0.ubs5hkl.mongodb.net/")
DATABASE_NAME = "linguifydb"
client = MongoClient(CONNECTION_STRING)
database = client[DATABASE_NAME]

@app.route('/api/linguify/GetUser', methods=['GET'])
def get_user():
    users = list(database.linguifycollection.find({}))
    for user in users:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
    return jsonify(users)

@app.route('/api/linguify/AddUser', methods=['POST'])
def add_user():
    new_user_data = request.json
    num_of_docs = database.linguifycollection.count_documents({})
    new_user = {
        'id': str(num_of_docs + 1),
        'topic': new_user_data.get('topic'),
        'name': new_user_data.get('name'),
        'surname': new_user_data.get('surname'),
        'email': new_user_data.get('email'),
        'phone': new_user_data.get('phone'),
        'message': new_user_data.get('message')
    }
    database.linguifycollection.insert_one(new_user)
    return jsonify({"message": "Added Successfully"}), 201

@app.route('/api/linguify/DeleteUser', methods=['DELETE'])
def delete_user():
    user_id = request.args.get('id')
    database.linguifycollection.delete_one({'id': user_id})
    return jsonify({"message": "Deleted Successfully"}), 200

if __name__ == '__main__':
    app.run(port=5038)
