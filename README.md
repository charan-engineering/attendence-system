# Facial Recognition Attendance System

A standalone, frontend-only web application for automated attendance tracking using facial recognition technology. This system runs entirely in the browser without relying on a backend server or database. It uses a modern React frontend and leverages local browser storage for data persistence.

## 🌟 Features

- **Facial Recognition**: Real-time face detection and recognition using `face-api.js` (running directly in the browser).
- **Frontend-Only Architecture**: Zero backend setup required. Everything runs locally in the browser.
- **Local Data Persistence**: Utilizes `IndexedDB` and `localStorage` to securely save user profiles, face descriptors, and attendance logs.
- **CSV Export**: Easily export attendance data directly from the browser.
- **Modern UI**: Built with React and Vite for a fast and responsive user experience.

## 🛠️ Technology Stack

- **Frontend Framework**: React, Vite
- **Routing**: React Router DOM
- **Facial Recognition**: `face-api.js`
- **Data Storage**: `IndexedDB` & `localStorage` (No external database required)

---

## 🚀 How to Run (Local Development)

### Prerequisites
- Node.js (v18 or higher recommended)

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd "attendence system"
```

### 2. Frontend Setup
1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Load Machine Learning Models:
   Ensure the `face-api.js` models are located in the `frontend/public/models` directory.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 📦 Deployment Guide

Since this is a frontend-only application, deploying it is incredibly easy and free on platforms like Vercel, Netlify, or GitHub Pages.

### Deployment (e.g., Vercel, Netlify)
1. Ensure the `face-api.js` models are checked into your repository under `frontend/public/models/`.
2. On Vercel or Netlify, create a new project pointing to your repository's `frontend` directory.
3. Set the **Build Command** to: `npm run build`
4. Set the **Output Directory** to: `dist`
5. Deploy the application. The app will work seamlessly using the browser's local storage.

---

## ⚠️ Common Tech Stack Errors & Troubleshooting

1. **"npm ERR! missing script: start"**
   - **Cause:** You ran `npm start`. Vite uses `dev` instead of `start`.
   - **Fix:** Always run `npm run dev` to start the frontend server.

2. **npm install fails in the root directory**
   - **Cause:** You tried running `npm install` in the `attendence system` root folder.
   - **Fix:** You must `cd frontend` first, then run `npm install`.

3. **Face API Models Failed to Load (404 Error)**
   - **Cause:** The machine learning weight files for `face-api.js` are missing.
   - **Fix:** Ensure that the required model files (like `ssd_mobilenetv1`, `face_landmark_68_net`, etc.) are placed exactly in the `frontend/public/models/` directory.

4. **Data Disappears on Different Devices**
   - **Cause:** Because this project uses `IndexedDB` and `localStorage`, all data is stored locally on the specific browser and device you are using.
   - **Fix:** This is expected behavior for a serverless, database-free architecture. To back up or share data, you can build or use a CSV export feature.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the ISC License.
