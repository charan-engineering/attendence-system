import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
const faceapi = window.faceapi;

function UserDashboard() {
  const [status, setStatus] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const loadModels = async () => {
      setStatus("Loading Face Detection...");
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        startVideo();
      } catch (err) {
        setStatus("Failed to load models.");
      }
    };
    loadModels();
  }, [navigate]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if(videoRef.current) videoRef.current.srcObject = stream;
        setStatus("Ready. Click Mark Attendance.");
      })
      .catch((err) => {
        setStatus("Camera disabled.");
      });
  };

  const handleMarkAttendance = async () => {
    setStatus("Scanning face...");
    if (!videoRef.current || videoRef.current.readyState !== 4) return;

    try {
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        setStatus("No face detected. Please face the camera.");
        return;
      }
      
      const savedDescriptorArr = JSON.parse(localStorage.getItem('faceDescriptor'));
      const savedDescriptor = new Float32Array(savedDescriptorArr);
      const distance = faceapi.euclideanDistance(detection.descriptor, savedDescriptor);

      if (distance < 0.6) {
        try {
          const res = await api.post('/attendance');
          setStatus(`Success! Attendance marked at ${new Date(res.data.record.timestamp).toLocaleTimeString()}`);
        } catch (err) {
          setStatus("API Error: Backend failed to save attendance.");
        }
      } else {
        setStatus("Face mismatch! You do not match the registered user.");
      }
    } catch (err) {
      setStatus("Scanning Error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Welcome, {userName}</h1>
        <p style={{marginBottom: '1rem', color: '#ccc'}}>Student Dashboard</p>
        
        <div className="video-container" style={{height: '300px'}}>
          <video ref={videoRef} width="720" height="560" autoPlay muted playsInline />
          {!modelsLoaded && <div className="video-overlay"><div className="spinner"></div></div>}
        </div>

        <p className="status" style={{minHeight: '20px', fontWeight: 'bold'}}>{status}</p>

        <div className="controls">
          <button onClick={handleMarkAttendance} className="btn register-btn" disabled={!modelsLoaded}>🔍 Mark Attendance</button>
          <button onClick={handleLogout} className="btn mark-btn" style={{marginTop: '10px'}}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
