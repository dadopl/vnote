import os
import subprocess
import uuid
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

OUTPUT_DIR = os.environ.get('PIPER_OUTPUT_DIR', '/app/output')
MODELS_DIR = '/app/models'
DEFAULT_VOICE = 'pl_PL-gosia-medium'

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_model_path(voice):
    """Get path to voice model file"""
    return os.path.join(MODELS_DIR, f"{voice}.onnx")


@app.route('/synthesize', methods=['POST'])
def synthesize():
    """Generate audio from text using Piper TTS"""
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({'error': 'Missing text parameter'}), 400

    text = data['text']
    voice = data.get('voice', DEFAULT_VOICE)

    if not text.strip():
        return jsonify({'error': 'Empty text'}), 400

    model_path = get_model_path(voice)
    if not os.path.exists(model_path):
        return jsonify({'error': f'Voice model not found: {voice}'}), 400

    # Generate unique filename
    audio_id = str(uuid.uuid4())[:8]
    timestamp = int(time.time() * 1000)
    filename = f"piper_{timestamp}_{audio_id}.wav"
    output_path = os.path.join(OUTPUT_DIR, filename)

    try:
        # Run piper command with local model
        process = subprocess.run(
            ['piper', '--model', model_path, '--output_file', output_path],
            input=text.encode('utf-8'),
            capture_output=True,
            timeout=120
        )

        if process.returncode != 0:
            error_msg = process.stderr.decode('utf-8', errors='ignore')
            return jsonify({'error': f'Piper error: {error_msg}'}), 500

        # Get file size
        file_size = os.path.getsize(output_path)

        return jsonify({
            'success': True,
            'audio': {
                'id': audio_id,
                'filename': filename,
                'size': file_size,
                'voice': voice
            }
        })

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'TTS generation timeout'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    """Get generated audio file"""
    filepath = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Audio not found'}), 404

    return send_file(filepath, mimetype='audio/wav')


@app.route('/audio/<filename>', methods=['DELETE'])
def delete_audio(filename):
    """Delete audio file"""
    filepath = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Audio not found'}), 404

    try:
        os.remove(filepath)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/audios', methods=['GET'])
def list_audios():
    """List all generated audio files"""
    try:
        files = []
        for filename in os.listdir(OUTPUT_DIR):
            if filename.startswith('piper_') and filename.endswith('.wav'):
                filepath = os.path.join(OUTPUT_DIR, filename)
                files.append({
                    'filename': filename,
                    'size': os.path.getsize(filepath),
                    'created': os.path.getctime(filepath)
                })

        # Sort by creation time, newest first
        files.sort(key=lambda x: x['created'], reverse=True)

        return jsonify({'audios': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/voices', methods=['GET'])
def list_voices():
    """List available Piper voices - only downloaded models"""
    voices = [
        {'id': 'pl_PL-gosia-medium', 'name': 'Gosia (Polish)', 'language': 'pl'},
        {'id': 'en_US-lessac-medium', 'name': 'Lessac (English)', 'language': 'en'}
    ]
    return jsonify({'voices': voices, 'default': DEFAULT_VOICE})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

