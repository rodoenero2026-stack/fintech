import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      const response = await axios.post('https://fintechnova-api.onrender.com/api/login', { 
        email: correo, 
        password: password 
      });
      
      const data = response.data; 

      // Guardamos todo en el almacenamiento local
      localStorage.setItem('userRole', 'user'); 
      if (data.Token) localStorage.setItem('token', data.Token);
      if (data.Usuario) localStorage.setItem('userName', data.Usuario);

      // --- INTENTO DE NAVEGACIÓN ---
      console.log("Navegando a dashboard...");
      
      // Primero intentamos la forma elegante de React
      navigate('/dashboard');

      // Si en 1 segundo seguimos aquí, forzamos la entrada a la brava
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
      }, 1000);
      
    } catch (error) {
      alert("❌ Error: Revisa tus datos o la conexión.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#1e293b' }}>FintechNova API</h1>
        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Correo</label>
            <input type="email" style={inputStyle} value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

// Estilos (se mantienen igual que antes)
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '16px', width: '350px', textAlign: 'center' };
const inputGroup = { textAlign: 'left', marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default Login;