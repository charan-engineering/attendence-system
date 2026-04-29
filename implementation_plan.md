# Frontend-Only Facial Recognition Attendance System

We will build a modern, responsive web application using Vite and plain JavaScript, without any backend server. It will utilize `face-api.js` for facial recognition and IndexedDB/localStorage for data persistence.

## User Review Required

> [!IMPORTANT]  
> Since `face-api.js` requires specific pre-trained machine learning models to work, I will include a small Node.js script (`download-models.js`) to automatically download these models into the `public/models` directory. This saves you the hassle of manually downloading them. Is this acceptable, or would you strictly prefer manual download instructions?

> [!IMPORTANT]
> Since this is a frontend-only app, the "Login" system will use hardcoded credentials (e.g., `admin` / `password123`) and validate on the client-side. Please confirm if this is acceptable for your use case.

## Proposed Changes

### Project Foundation
- Initialize a standard Vite project using standard node tools in `c:\Users\CHARAN\Desktop\attendence`.
- Set up `package.json` with necessary scripts (dev, build, preview) and add a script to download face models.
- Install `face-api.js` via npm.

### Configuration & Models
#### [NEW] `download-models.js`
A Node script to fetch the required weights for `face-api.js` (SSD Mobilenet v1, Face Landmark 68, Face Recognition) and save them to `public/models/`.

### HTML Pages
#### [NEW] `index.html`
The main dashboard page. Will include:
- A hidden redirect script to send unauthenticated users to `login.html`.
- Video element for webcam feed.
- Dashboard stats (Total registered, Today's attendance).
- Registration form for new users.
- Live attendance list.
- Action buttons (Export CSV, Reset Data, Dark Mode toggle).

#### [NEW] `login.html`
A simple, modern login page with a username and password form.

### Application Logic (`src/`)
#### [NEW] `src/auth.js`
Handles the login logic, session storage via `localStorage`, and redirection. Includes logout functionality.

#### [NEW] `src/storage.js`
Wraps `IndexedDB` to securely and efficiently store user profiles and their face descriptors (which are Float32Arrays). Manages saving and retrieving daily attendance records.

#### [NEW] `src/face.js`
Encapsulates `face-api.js` logic. Handles:
- Loading models from `/public/models`.
- Accessing the webcam.
- Detecting faces and computing face descriptors.
- Comparing real-time descriptors against the stored ones in IndexedDB.

#### [NEW] `src/main.js`
The central controller for the dashboard. Ties everything together:
- Updates UI elements (dashboard counts, live attendance table).
- Handles user registration (taking webcam snapshots and saving descriptors).
- Runs the continuous face recognition loop to mark attendance automatically.
- Prevents duplicate attendance entries.
- Plays a notification sound on successful marking.

#### [NEW] `src/style.css`
A comprehensive CSS file implementing a modern, rich aesthetic:
- Glassmorphism effects.
- Dynamic micro-animations (hover states, scanning animations).
- Dark mode toggle support.
- Responsive design for various screen sizes.

## Verification Plan

### Automated/Manual Testing
1. **Setup**: Run `npm install` followed by `npm run download-models`.
2. **Launch**: Run `npm run dev` and open the app in a browser.
3. **Authentication**: Verify that accessing the root redirects to `login.html`. Login with the hardcoded credentials.
4. **Registration**: Use the webcam to register a new user face. Verify the face descriptor is stored in IndexedDB.
5. **Recognition**: Allow the webcam to scan a registered face. Verify that attendance is automatically marked and no duplicates are created on the same day.
6. **Data Management**: Verify the CSV export downloads correctly and the "Reset Data" button clears all IndexedDB/localStorage data.
