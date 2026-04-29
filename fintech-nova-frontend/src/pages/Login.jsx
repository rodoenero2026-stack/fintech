import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://fintechnova-api.onrender.com/api/login', { 
        email: correo, 
        password: password 
      });
      
      const data = response.data;

if (data.token) localStorage.setItem('token', data.token);
if (data.usuario) localStorage.setItem('userName', data.usuario);
localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
      
    } catch (error) {
      setError('❌ Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#1e293b', marginBottom: '10px' }}>FintechNova A</h1>
        <p style={{ color: '#64748b', marginBottom: '25px' }}>Inicia sesión con tu cuenta</p>

        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="admin@nova.com" 
              style={inputStyle}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          ¿No tienes cuenta? <span onClick={() => navigate('/registro')} style={linkStyle}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '380px', textAlign: 'center' };
const inputGroup = { textAlign: 'left', marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };
const linkStyle = { color: '#2563eb', cursor: 'pointer', fontWeight: '600' };

export default Login;