# **DermaScan: AI-Powered Melanoma Detection System**

DermaScan is an end-to-end melanoma detection system designed to support dermatologists in analyzing skin lesions and identifying potential melanoma. The system integrates a full-stack web application, a Python AI inference backend, and a complete deep-learning training pipeline based on modern computer-vision research.

---

# **Overview**

This project has three major components:

### **1. Web Application (Next.js + Node.js + MongoDB)**

A full-stack interface where dermatologists can:

- Create an account
- Upload lesion images
- View model predictions
- Access patient scan history

### **2. Python-Based Inference Backend**

A standalone Python server that:

- Receives images from the web application
- Preprocesses and normalizes inputs
- Loads the trained EfficientNet-B0 model
- Predicts whether lesions are **melanoma** or **benign**

### **3. Model Training Pipeline**

A Jupyter-notebook-based environment that handles:

- Dataset preprocessing
- Image augmentation
- Model training using EfficientNet-B0
- Evaluation and testing
- Saving final weights for deployment

The training approach is **inspired by**:

> **“Classification of melanoma skin cancer based on image data set using different neural networks,” Scientific Reports (Nature), 2024.** > [https://www.nature.com/articles/s41598-024-75143-4](https://www.nature.com/articles/s41598-024-75143-4)

> **“the dataset mentioned in the paper and used in the project:** >
> [text](https://www.kaggle.com/datasets/hasnainjaved/melanoma-skin-cancer-dataset-of-10000-images)

“The paper evaluated CNN, ResNet-18, and EfficientNet-B0 and reported that EfficientNet-B0 performed best on their dataset, which motivated my choice of architecture for this project.”

---

# **Why I Built This Project**

Early detection of melanoma significantly improves patient outcomes, but access to dermatologists is limited in many regions. I wanted to explore how AI systems could:

- Provide consistent, high-accuracy preliminary screening
- Assist clinicians in reviewing skin lesions
- Make diagnostic tools more accessible in low-resource settings
- Combine deep learning with real-world healthcare workflows

DermaScan allowed me to connect my interests in **AI, medical imaging, and full-stack development** while building a complete and practical clinical-support tool.

---

# **Key Features**

- EfficientNet-B0–based melanoma classifier
- 92% accuracy on binary melanoma vs benign classification
- Secure user authentication
- Scan history management
- Clean and user-friendly web interface

---

<img width="1440" height="780" alt="Screenshot 2025-11-19 at 22 34 02" src="https://github.com/user-attachments/assets/0e880664-e01f-46e9-b04d-5a82556e49f8" />

<img width="1440" height="779" alt="Screenshot 2025-11-19 at 22 19 42" src="https://github.com/user-attachments/assets/7e441968-5b40-4305-b671-a8afd534e69d" />

<img width="1440" height="779" alt="Screenshot 2025-11-19 at 22 21 25" src="https://github.com/user-attachments/assets/ff5b2d00-f4d9-4e6a-aceb-5bd4222abf04" />



# **Model Architecture**

The final model uses **EfficientNet-B0** pretrained on ImageNet, followed by:

- Global Average Pooling
- Dropout (0.5)
- Dense layer with **sigmoid** activation (binary classification)

This is consistent with the methodology and findings of the referenced 2024 Scientific Reports paper, which highlighted EfficientNet-B0 as the best-performing architecture for melanoma detection.

---

# **Model Performance**

Evaluated on a 1,000-image test set (balanced: 500 benign, 500 malignant):

| Class         | Precision | Recall | F1-Score | Support |
| ------------- | --------- | ------ | -------- | ------- |
| **Benign**    | 0.89      | 0.95   | 0.92     | 500     |
| **Malignant** | 0.95      | 0.88   | 0.92     | 500     |

**Overall Accuracy:** **92%**
**Macro F1-Score:** **0.92**

These results demonstrate strong generalization with excellent malignant precision, meaning fewer false positives for cancer predictions.

---

# **System Architecture**

```
 User Interface (Next.js)
            │
            ▼
   Node.js API Server  →  MongoDB
            │
            ▼
   Python Inference Backend → EfficientNet-B0 Model
```

---

# **Installation & Setup**

## 1. Clone the Repository

```bash
git clone https://github.com/Ardalankt/Melanoma-detection-web-app.git
cd Melanoma-detection-web-app
```

---

## 2. Web App (Next.js + Node.js)

```bash
cd web app
npm install
npm run dev
npx nodemon server/server.js
```

Create a `.env` file:

```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/dermascan
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:5050/api
PYTHON_API_URL=http://localhost:5040
```

---

## 3. Python Backend

Once you finish training the model using the notebook in skin-cancer-model/skin-cancer.ipynb, export the final weights to this folder.

```bash
cd skin-cancer-api/python_api
bash start.sh
```

---

## 4. Model Training

Download the data set then Open and run:

```
skin-cancer-model/skin-cancer.ipynb
```

This notebook contains the full training pipeline based on the EfficientNet-B0 architecture.

---

# **Future Work**

### **Model & Data Enhancements**

- Add **multi-class classification** for multiple skin lesion categories
- Incorporate **patient metadata** known to influence diagnosis:

  - Age
  - Sex
  - Lesion location

- Integrate **non-dermoscopic mobile images**, enabling real-world usability
- Add explainability tools such as Grad-CAM or attention heatmaps
