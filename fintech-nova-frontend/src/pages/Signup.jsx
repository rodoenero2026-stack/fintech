import React, { useState } from 'react';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarUsuario = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("❌ Las contraseñas no coinciden.");
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:3001/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        password: formData.password
      })
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      alert("✅ " + data.message);
      // Redirigir al login
    } else {
      alert("⚠️ " + data.message); // Aquí mostrará "El correo ya está registrado"
    }
  } catch (error) {
    alert("❌ Error al conectar con el servidor");
  }
};

  return (
    <form onSubmit={registrarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h2>Crear Cuenta</h2>
      <input name="nombres" placeholder="Nombres" onChange={manejarCambio} required />
      <input name="apellidos" placeholder="Apellidos" onChange={manejarCambio} required />
      <input name="correo" type="email" placeholder="Correo electrónico" onChange={manejarCambio} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={manejarCambio} required />
      <input name="confirmPassword" type="password" placeholder="Confirmar Contraseña" onChange={manejarCambio} required />
      <button type="submit">Registrarse</button>
    </form>
  );
};