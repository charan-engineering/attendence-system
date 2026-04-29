import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
const faceapi = window.faceapi;

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      setStatus("Loading Face Detection Models...");
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatus("Starting Camera...");
        startVideo();
      } catch (err) {
        setStatus("Failed to load models: " + err.message);
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if(videoRef.current) videoRef.current.srcObject = stream;
        setStatus("Camera ready. Position your face clearly.");
      })
      .catch((err) => {
        setStatus("Failed to access camera.");
      });
  };

  const getFaceDescriptor = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) return null;
    try {
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        setStatus("No face detected. Please face the camera.");
        return null;
      }
      return detection.descriptor;
    } catch (err) {
      setStatus("Error scanning face: " + err.message);
      return null;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("Scanning face and registering...");
    
    const descriptor = await getFaceDescriptor();
    if (!descriptor) return;

    try {
      const descriptorArray = Array.from(descriptor);
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        faceDescriptor: descriptorArray
      });

      // Login immediately
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('faceDescriptor', JSON.stringify(res.data.faceDescriptor));

      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
      
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1>Register</h1>
        
        <div className="video-container" style={{height: '250px'}}>
          <video ref={videoRef} width="720" height="560" autoPlay muted playsInline />
          {!modelsLoaded && <div className="video-overlay"><div className="spinner"></div></div>}
        </div>

        <p className="status" style={{minHeight: '20px'}}>{status}</p>

        <form onSubmit={handleRegister} className="controls">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn register-btn" disabled={!modelsLoaded}>Register Account & Face</button>
        </form>
        <p style={{marginTop: '10px'}}>Already have an account? <Link to="/login" style={{color: '#00f2fe'}}>Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
