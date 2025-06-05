# SnapShare

![SnapShare Logo](./SnapShare/ProjectSpecification//logo%20croped.png)

## Overview

SnapShare is an intelligent photo management platform designed for event organizers to efficiently handle event photos. It features advanced facial recognition to automatically sort images and allows event owners to share photos privately with relevant participants.

## Features

### 1. Event Photo Upload

- Easy bulk photo uploads.
- Automatic sorting and filtering based on recognized faces.
- Secure access control ensures only authorized users can view photos.

### 2. Advanced Facial Recognition

- Algorithms for facial recognition and classification.
- Grouping photos based on identified participants.

### 3. User-Friendly Web Interface

- Personalized photo display for each user.
- Optional shared albums for event collaboration.
- Filtering and searching based on participants or categories.

### 4. Enhanced Event Experience with Technology

- Simple and quick access to photos from any device.
- Easy sharing with additional participants.

##  Installation Guide

This guide explains how to install and run all parts of the application: the face recognition service, the backend (BFF), and the frontend.



## 📦 Clone the Repository

```bash
git clone https://github.com/DorMor1999/SnapShare
```



## 🧠 Face Recognition Service (Python)

```bash
cd .\SnapShare\SourceCode\backend\face_recognition_service\
pip install -r requirements.txt
# Run the face recognition service
python app.py
```



## 🖥️ BFF (Backend For Frontend - Node.js)

```bash
cd cd .\SnapShare\SourceCode\backend\bff\
npm install
# Run the BFF server
npm run dev
```



## 🌐 Frontend (React App)

```bash
cd .\SnapShare\SourceCode\frontend\
npm install
# Run the frontend development server
npm run dev
```



Make sure all services are running at the same time for full functionality.

## Technologies Used

- **Frontend:** React, TypeScript
- **Backend:**
  - For frontend communication: Node.js, TypeScript, Express
  - Face recognition service: Python, Flask, OpenCV, face_recognition
- **Database:** Azure Cosmos DB for MongoDB
- **Storage:** Azure Blob Storage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

- **[Doron Ben Zaken](https://github.com/doronBenZaken)**
- **[Dor Mor](https://github.com/DorMor1999)**
- **[Itay Razon](https://github.com/Itayraz12)**

## Contact

For any inquiries, feel free to reach out via email or create an issue in the repository.
