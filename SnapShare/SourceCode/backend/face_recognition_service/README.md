# 👤 Face Recognition Service API

This is a **Flask-based RESTful API** designed for **encoding face profiles** and performing **face recognition** across a set of photos associated with events. It uses photo uploads, computes facial encodings, and matches them against user profiles.

## 🚀 Features

- Encode multiple face photos for a given user profile.
- Compare uploaded event photos with user face encodings.
- JSON-based API for easy integration.
- Modular design using Blueprints.
- Error handling for common issues like missing data or invalid files.
- Secret key authentication ("SERVICE-SECRET-KEY") for secure access to the API.

## 📁 Project Structure

```
.
├── app.py
├── config.py
├── routes/
│   ├── profile_routes.py
│   └── recognition_routes.py
├── services/
│   ├── recognition_service.py
│   └── storage_services.py
```

## 🛠️ Setup & Installation

```bash
git clone https://github.com/DorMor1999/face_recognition_service
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

## ▶️ Running the Application

```bash
python app.py
```

## 📡 API Endpoints

### ➕ Encode Profile Photos

**POST** `/profiles/<user_id>/encode`

Form Data: `files[]`

### 🧠 Recognize Faces from Event Photos

**POST** `/events/<event_id>/recognize`

```json
{
  "event_photos_keys": ["photo1.jpg"],
  "users_encodes": [{"user_id": "123", "profile_encoding": [...]}]
}
```

## ⚠️ Error Handling

- `400` – Bad Request
- `404` – Not Found
- `500` – Internal Server Error

## 🧱 Built With

- Python
- Flask
- NumPy
- face_recognition

## 📃 License

This project is licensed under the [MIT License](LICENSE).