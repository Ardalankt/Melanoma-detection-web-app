import os
import sys
import json
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.efficientnet import (
    preprocess_input,
)


MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_finetuned_best.keras")
THRESHOLD = 0.5

# Load Model
model = load_model(MODEL_PATH)


# Image Preprocessing
def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = preprocess_input(image)
    return np.expand_dims(image, axis=0)


if len(sys.argv) != 2:
    print(json.dumps({"error": "Usage: python predict.py <image_path>"}))
    sys.exit(1)

image_path = sys.argv[1]
if not os.path.exists(image_path):
    print(json.dumps({"error": f"Image not found: {image_path}"}))
    sys.exit(1)


try:
    image = preprocess_image(image_path)
    pred = model.predict(image, verbose=0)[0][0]
    label = "Melanoma" if pred > THRESHOLD else "Benign"
    confidence = float(pred if label == "Melanoma" else 1 - pred)

    details = {
        "Benign": "The lesion appears to have regular borders and consistent coloration, which are typically associated with benign moles.",
        "Melanoma": "The lesion exhibits characteristics commonly associated with melanoma, including irregular borders and varied coloration.",
    }

    result = {
        "prediction": label,
        "confidence": round(confidence * 100, 2),
        "riskLevel": "high" if label == "Melanoma" else "low",
        "details": details[label],
    }

    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
