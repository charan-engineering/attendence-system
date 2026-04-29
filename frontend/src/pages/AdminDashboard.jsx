import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'attendance'
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const usersRes = await api.get('/users');
      const attendanceRes = await api.get('/attendance');
      setUsers(usersRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const deleteRecord = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/attendance/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container" style={{maxWidth: '800px', margin: '0 auto', padding: '2rem'}}>
      <div className="glass-card" style={{maxWidth: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn mark-btn" style={{flex: '0 0 auto', padding: '8px 16px', fontSize: '0.9rem'}}>Logout</button>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
          <button 
            className={`btn ${activeTab === 'users' ? 'register-btn' : 'mark-btn'}`}
            onClick={() => setActiveTab('users')}
          >Manage Users</button>
          <button 
            className={`btn ${activeTab === 'attendance' ? 'register-btn' : 'mark-btn'}`}
            onClick={() => setActiveTab('attendance')}
          >View Attendance</button>
        </div>

        {activeTab === 'users' ? (
          <div style={{textAlign: 'left'}}>
            <h3>Registered Users ({users.length})</h3>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                  <th style={{padding: '10px'}}>Name</th>
                  <th style={{padding: '10px'}}>Email</th>
                  <th style={{padding: '10px'}}>Role</th>
                  <th style={{padding: '10px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <td style={{padding: '10px'}}>{u.name}</td>
                    <td style={{padding: '10px'}}>{u.email}</td>
                    <td style={{padding: '10px'}}>{u.role}</td>
                    <td style={{padding: '10px'}}>
                      <button onClick={() => deleteUser(u._id)} style={{background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{textAlign: 'left'}}>
            <h3>Attendance Records ({attendance.length})</h3>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                  <th style={{padding: '10px'}}>Name</th>
                  <th style={{padding: '10px'}}>Email</th>
                  <th style={{padding: '10px'}}>Timestamp</th>
                  <th style={{padding: '10px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a._id} style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <td style={{padding: '10px'}}>{a.name}</td>
                    <td style={{padding: '10px'}}>{a.userId?.email || 'N/A'}</td>
                    <td style={{padding: '10px'}}>{new Date(a.timestamp).toLocaleString()}</td>
                    <td style={{padding: '10px'}}>
                      <button onClick={() => deleteRecord(a._id)} style={{background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
