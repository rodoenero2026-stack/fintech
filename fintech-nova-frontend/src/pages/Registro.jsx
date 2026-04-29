import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    password: ''
  });
  const navigate = useNavigate();
/////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CORRECCIÓN 1: Adaptamos los datos para que coincidan EXACTAMENTE con lo que espera tu C# (Swagger)
      const payloadParaCSharp = {
        nombre: formData.nombres + " " + formData.apellidos, // Unimos nombre y apellido en una sola variable
        email: formData.correo, // Tu backend espera 'email', no 'correo'
        password: formData.password
      };

      // CORRECCIÓN 2: Apuntamos a tu API oficial en Render
      await axios.post('https://fintechnova-api.onrender.com/api/registro', payloadParaCSharp);
      
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate('/'); // Redirige al Login
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrarse. Verifica si el servidor está activo.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e293b' }}>Crear Cuenta</h2>
        <input type="text" placeholder="Nombres" required style={inputStyle} onChange={(e) => setFormData({...formData, nombres: e.target.value})} />
        <input type="text" placeholder="Apellidos" required style={inputStyle} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} />
        <input type="email" placeholder="Correo Electrónico" required style={inputStyle} onChange={(e) => setFormData({...formData, correo: e.target.value})} />
        <input type="password" placeholder="Contraseña" required style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" style={buttonStyle}>Registrarse</button>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          ¿Ya tienes cuenta? <span onClick={() => navigate('/')} style={{ color: '#2563eb', cursor: 'pointer' }}>Inicia sesión</span>
        </p>
      </form>
    </div>
  );
};

// Estilos rápidos (Agregué boxSizing para que los inputs no se salgan del cuadro)
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default Registro;