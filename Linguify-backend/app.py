import os
import secrets
from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer, AutoTokenizer, AutoModelForSequenceClassification
import torch
import sys
import numpy as np
import whisper
import ffmpeg
import yt_dlp
from googletrans import Translator
from gtts import gTTS
from pydub import AudioSegment
import tempfile

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))

# MongoDB configuration
CONNECTION_STRING = os.getenv('MONGO_URI', "mongodb+srv://admin:BuildspaceS5@cluster0.ubs5hkl.mongodb.net/")
DATABASE_NAME = "linguifydb"
client = MongoClient(CONNECTION_STRING)
database = client[DATABASE_NAME]
userDB = client['linguifyusersdb']

# ------- start of translate functionality ---------
model_name_translate = "facebook/m2m100_418M"
tokenizer_translate = M2M100Tokenizer.from_pretrained(model_name_translate)
model_translate = M2M100ForConditionalGeneration.from_pretrained(model_name_translate)

def translate(text, src_lang, tgt_lang):
    tokenizer_translate.src_lang = src_lang
    encoded_text = tokenizer_translate(text, return_tensors="pt")
    generated_tokens = model_translate.generate(**encoded_text, forced_bos_token_id=tokenizer_translate.get_lang_id(tgt_lang))
    translated_text = tokenizer_translate.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return translated_text

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

# ------- end of translate functionality ---------

# ------- start of text detection functionality ---------
model_textDetection_name = "papluca/xlm-roberta-base-language-detection"
tokenizer_textDetection = AutoTokenizer.from_pretrained(model_textDetection_name)
model_textDetection = AutoModelForSequenceClassification.from_pretrained(model_textDetection_name)

def detect_language(text):
    try:
        inputs = tokenizer_textDetection(text, padding=True, truncation=True, return_tensors="pt")

        with torch.no_grad():
            logits = model_textDetection(**inputs).logits

        preds = torch.softmax(logits, dim=-1)
        id2lang = model_textDetection.config.id2label
        vals, idxs = torch.max(preds, dim=1)
        detected_language = id2lang[idxs.item()]

        lang_code_to_name = {
            'ar': 'Arabic',
            'bg': 'Bulgarian',
            'de': 'German',
            'el': 'Modern Greek',
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'hi': 'Hindi',
            'it': 'Italian',
            'ja': 'Japanese',
            'nl': 'Dutch',
            'pl': 'Polish',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'sw': 'Swahili',
            'th': 'Thai',
            'tr': 'Turkish',
            'ur': 'Urdu',
            'vi': 'Vietnamese',
            'zh': 'Chinese',
        }

        return lang_code_to_name.get(detected_language, 'Unknown')

    except Exception as e:
        app.logger.error(f"Error during language detection: {e}")
        raise

@app.route('/api/linguify/text-detection', methods=['POST'])
def language_detection():
    try:
        data = request.json
        app.logger.debug(f"Received data: {data}")
        text = data.get('text')

        if not text:
            return jsonify({"error": "Missing required parameters"}), 400

        detected_language = detect_language(text)
        app.logger.debug(f"Detected language: {detected_language}")
        return jsonify({"detected_language": detected_language}), 200

    except Exception as e:
        app.logger.error(f"Error during language detection: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# ------- end of text detection functionality ---------

# ---------- start of video to text translation ----------

def download_video_for_text_conversion(video_url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'postprocessor_args': [
            '-ar', '16000'  
        ],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

def transcribe_audio_for_text_conversion(audio_path):
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

def transcribe_video_for_text_conversion(video_url):
    base_filename = "downloaded_audio"
    downloaded_audio = f"{base_filename}.mp3"
    actual_audio_file = f"{base_filename}.mp3.mp3"  
    
    try:
        download_video_for_text_conversion(video_url, downloaded_audio)
        
        if os.path.exists(actual_audio_file):
            os.rename(actual_audio_file, downloaded_audio)
        
        if os.path.exists(downloaded_audio):
            text = transcribe_audio_for_text_conversion(downloaded_audio)
            return text
        else:
            return "Audio file not found."
        
    except Exception as e:
        return f"An error occurred: {e}"
    
    finally:
        for file in [downloaded_audio, actual_audio_file]:
            if os.path.exists(file):
                os.remove(file)

@app.route('/api/linguify/video-to-text', methods=['POST'])
def video_to_text():
    try:
        data = request.json
        video_url = data.get('video_url')

        if not video_url:
            return jsonify({"error": "Missing required parameters"}), 400

        transcribed_text = transcribe_video_for_text_conversion(video_url)
        return jsonify({"transcribed_text": transcribed_text}), 200

    except Exception as e:
        app.logger.error(f"Error during video transcription: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
# ---------- end of video to text translation ----------

# --------- start of video to video translation ------------

def download_video(video_url, output_audio_path, output_video_path):
    ydl_opts_audio = {
        'format': 'bestaudio/best',
        'outtmpl': output_audio_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'postprocessor_args': [
            '-ar', '16000'
        ],
    }

    ydl_opts_video = {
        'format': 'bestvideo+bestaudio',
        'outtmpl': output_video_path,
        'merge_output_format': 'mp4'
    }

    with yt_dlp.YoutubeDL(ydl_opts_audio) as ydl:
        ydl.download([video_url])
    
    with yt_dlp.YoutubeDL(ydl_opts_video) as ydl:
        ydl.download([video_url])

def transcribe_audio(audio_path):
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"], result["segments"]
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None, None

def translate_video_text(text, target_lang):
    translator = Translator()
    translated = translator.translate(text, dest=target_lang)
    return translated.text

def text_to_speech_with_duration(text, lang, target_duration):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(temp_file.name)
    
    audio = AudioSegment.from_mp3(temp_file.name)
    current_duration = len(audio) / 1000  
    speed_factor = current_duration / target_duration
    
    adjusted_audio = audio.speedup(playback_speed=speed_factor)
    
    temp_file.close()
    os.unlink(temp_file.name)
    
    return adjusted_audio

def match_audio_duration(original_audio_path, translated_text, target_lang):
    original_audio = AudioSegment.from_file(original_audio_path)
    original_duration = len(original_audio) / 1000  
    
    translated_audio = text_to_speech_with_duration(translated_text, target_lang, original_duration)
    
    return translated_audio

def attach_audio_to_video(video_path, audio_path, output_path):
    video = ffmpeg.input(video_path).video
    audio = ffmpeg.input(audio_path).audio
    output = ffmpeg.output(video, audio, output_path, vcodec='libx264', acodec='aac', strict='experimental')
    ffmpeg.run(output)

def videoTranslateFunc(video_url, target_lang):
    base_filename = "downloaded_audio"
    downloaded_audio = f"{base_filename}.mp3"
    actual_audio_file = f"{base_filename}.mp3.mp3"
    video_filename = "downloaded_video.mp4"
    translated_audio = "translated_audio.mp3"
    output_video = "output_video.mp4"
    
    try:
        download_video(video_url, downloaded_audio, video_filename)
        
        if os.path.exists(actual_audio_file):
            os.rename(actual_audio_file, downloaded_audio)
        
        if os.path.exists(downloaded_audio):
            text, segments = transcribe_audio(downloaded_audio)
            if text:
                print("Transcribed Text:", text)
                
                translated_video_text = translate_video_text(text, target_lang)
                print("Translated Text:", translated_video_text)
                
                print("Generating translated audio with matched duration...")
                translated_audio_segment = match_audio_duration(downloaded_audio, translated_video_text, target_lang)
                translated_audio_segment.export(translated_audio, format="mp3")
                
                print("Attaching translated audio to video. This may take a while...")
                attach_audio_to_video(video_filename, translated_audio, output_video)
                print(f"Output video saved as {output_video}")
                return output_video

    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        for file in [downloaded_audio, actual_audio_file, translated_audio, video_filename]:
            if os.path.exists(file):
                os.remove(file)

    if os.path.exists(output_video):
        print(f"Final output video: {output_video}")
    else:
        print("Failed to create the output video.")

@app.route('/api/linguify/videoTranslation', methods=['POST'])
def translate_video():
    try:
        data = request.json
        video_url = data.get('text')
        tgt_lang = data.get('tgt_lang')

        print("inside the translate_video function in app.py")
        if not video_url or not tgt_lang:
            return jsonify({"error": "Missing required parameters"}), 400

        translated_video = videoTranslateFunc(video_url, tgt_lang)
        if translated_video:
            return jsonify({"translated_video": translated_video}), 200
        else:
            return jsonify({"error": "Failed to create the output video"}), 500

    except Exception as e:
        app.logger.error(f"Error during translation: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/api/linguify/get_video/<filename>', methods=['GET'])
def get_video(filename):
    try:
        base_dir = os.path.dirname(__file__)  
        video_path = os.path.join(base_dir, filename)

        if not os.path.isfile(video_path):
            return jsonify({"error": "File not found"}), 404

        return send_file(video_path, as_attachment=True)

    except Exception as e:
        app.logger.error(f"Error retrieving video: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------- end of video to video translation ------------

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
        user['_id'] = str(user['_id'])  
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
