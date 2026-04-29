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
////////
  try {
    // CORRECCIÓN 1: Apuntamos a tu URL de Render oficial
    const respuesta = await fetch('https://fintechnova-api.onrender.com/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // CORRECCIÓN 2: Traducimos los campos al formato de tu base de datos (nombre y email)
      body: JSON.stringify({
        nombre: formData.nombres + " " + formData.apellidos,
        email: formData.correo,
        password: formData.password
      })
    });

    if (respuesta.ok) {
      alert("✅ ¡Cuenta creada exitosamente en FintechNova!");
      window.location.href = '/'; // Redirige automáticamente al Login
    } else {
      // Leemos el texto del error que mande C# por si el correo ya existe
      const errorData = await respuesta.text();
      alert("⚠️ No se pudo registrar: " + errorData); 
    }
  } catch (error) {
    alert("❌ Error al conectar con el servidor en Render");
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

export default Registro;