import React, { useState } from 'react';

const Login = () => {
  const [credenciales, setCredenciales] = useState({ correo: '', password: '' });

  const manejarCambio = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        // Guardamos los datos en localStorage para que el Dashboard te reconozca
        localStorage.setItem('userRole', userRole);
        alert("¡Bienvenido!");
        window.location.href = '/dashboard'; 
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      alert("❌ Error: Verifica que el servidor de Node esté encendido.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={iniciarSesion} style={styles.form}>
        <h2 style={{ color: '#1a2b4b' }}>FintechNova Login</h2>
        <input name="correo" type="email" placeholder="Correo" onChange={manejarCambio} required style={styles.input} />
        <input name="password" type="password" placeholder="Contraseña" onChange={manejarCambio} required style={styles.input} />
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7fe' },
  form: { padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px', width: '350px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontSize: '16px', cursor: 'pointer' }
};

export default Login;