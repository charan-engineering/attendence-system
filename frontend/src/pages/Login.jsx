import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('faceDescriptor', JSON.stringify(res.data.faceDescriptor));

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1>Login</h1>
        {error && <p className="status" style={{color: '#ff4d4d'}}>{error}</p>}
        <form onSubmit={handleLogin} className="controls">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn register-btn">Sign In</button>
        </form>
        <p style={{marginTop: '20px'}}>New here? <Link to="/register" style={{color: '#00f2fe'}}>Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
