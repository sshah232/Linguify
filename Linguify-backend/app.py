import os
import secrets
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
import torch

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))

# MongoDB configuration
CONNECTION_STRING = os.getenv('MONGO_URI', "mongodb+srv://admin:BuildspaceS5@cluster0.ubs5hkl.mongodb.net/")
DATABASE_NAME = "linguifydb"
client = MongoClient(CONNECTION_STRING)
database = client[DATABASE_NAME]
userDB = client['linguifyusersdb']

model_name = "facebook/m2m100_418M"
tokenizer = M2M100Tokenizer.from_pretrained(model_name)
model = M2M100ForConditionalGeneration.from_pretrained(model_name)

def translate(text, src_lang, tgt_lang):
    tokenizer.src_lang = src_lang
    encoded_text = tokenizer(text, return_tensors="pt")
    generated_tokens = model.generate(**encoded_text, forced_bos_token_id=tokenizer.get_lang_id(tgt_lang))
    translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return translated_text

@app.route('/detect-language', methods=['POST'])
def detect_language():
    data = request.json
    text = data.get('text', '')

    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits

    preds = torch.softmax(logits, dim=-1)

    id2lang = model.config.id2label
    vals, idxs = torch.max(preds, dim=1)
    detected_language = id2lang[idxs.item()]

    return jsonify({'detected_language': detected_language})

@app.route('/api/linguify/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        text = data.get('text')
        src_lang = data.get('src_lang')
        tgt_lang = data.get('tgt_lang')

        if not text or not src_lang or not tgt_lang:
            return jsonify({"error": "Missing required parameters"}), 400

        translated_text = translate(text, src_lang, tgt_lang)
        return jsonify({"translated_text": translated_text}), 200

    except Exception as e:
        app.logger.error(f"Error during translation: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# Login & Register
@app.route('/api/linguify/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Missing required parameters"}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        userDB.users.insert_one({
            "username": username,
            "password": hashed_password
        })

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error during signup: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/api/linguify/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Missing required parameters"}), 400

        user = userDB.users.find_one({"username": username})

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        session['user'] = username
        return jsonify({"message": "Login successful"}), 200

    except Exception as e:
        app.logger.error(f"Error during login: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/api/linguify/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/linguify/check-auth', methods=['GET'])
def check_auth():
    user = session.get('user')
    if user:
        return jsonify({"authenticated": True, "user": user}), 200
    return jsonify({"authenticated": False}), 200

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
