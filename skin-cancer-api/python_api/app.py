import os
import time
import json
import subprocess
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Setup
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400

    try:
        # Save image
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)
        logger.info(f"Saved image to {filepath}")

        # Call predict.py
        result = subprocess.run(
            ["python3", "predict.py", filepath], capture_output=True, text=True
        )

        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        logger.info("predict.py STDOUT:\n" + stdout)
        if stderr:
            logger.error("predict.py STDERR:\n" + stderr)

        # Parse prediction
        try:
            prediction = json.loads(stdout)
        except json.JSONDecodeError:
            logger.error("Failed to parse JSON output")
            logger.error(f"Raw stdout: {repr(stdout)}")
            return jsonify({"error": "Invalid response from model"}), 500

        prediction["imagePath"] = filepath
        return jsonify(prediction)

    except Exception as e:
        logger.exception("Prediction failed")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PYTHON_API_PORT", 5040))
    logger.info(f"Starting Skin Cancer API on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
