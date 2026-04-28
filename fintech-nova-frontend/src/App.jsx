import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { obtenerDatosUsuario } from './simulatedApi';
import { LayoutDashboard, Users, Bell, Search } from 'lucide-react';

// Importación de páginas
import UserDashboard from './pages/UserDashboard';
import LoanApplication from './pages/LoanApplication';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Pagos from './pages/Pagos';

// Estilos de navegación
const navBtnStyle = (active) => ({
  width: '100%',
  padding: '12px',
  marginBottom: '10px',
  background: active ? '#334155' : 'transparent',
  border: 'none',
  color: 'white',
  textAlign: 'left',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
});

const AdminPanel = () => {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [userFrein, setUserFrein] = useState(null); // Empezamos en null para evitar errores

  useEffect(() => {
    const cargarDatos = () => {
      const datos = obtenerDatosUsuario();
      if (datos) setUserFrein(datos);
    };
    
    cargarDatos();
    const interval = setInterval(cargarDatos, 2000);
    return () => clearInterval(interval);
  }, []);

  // Si no hay datos, mostramos un estado de carga en lugar de una pantalla en blanco
  if (!userFrein) return <div style={{ padding: '20px' }}>Cargando Panel de Administración...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: '260px', background: '#1e293b', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>FintechNova Admin</h2>
        <nav>
          <button onClick={() => setVistaActual('dashboard')} style={navBtnStyle(vistaActual === 'dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setVistaActual('usuarios')} style={navBtnStyle(vistaActual === 'usuarios')}>
            <Users size={20} /> Gestión Usuarios
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', width: '300px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="#64748b" />
            <input type="text" placeholder="Buscar..." style={{ border: 'none', marginLeft: '10px', outline: 'none' }} />
          </div>
          <Bell size={24} color={userFrein.statusSolicitud === 'pendiente' ? 'red' : '#64748b'} />
        </header>

        {vistaActual === 'dashboard' ? (
          <div>
            {userFrein.statusSolicitud === 'pendiente' && (
              <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>🔔 Nueva solicitud pendiente</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{userFrein.nombre} pide ${userFrein.montoSolicitado || 0}</p>
                </div>
                <button onClick={() => setVistaActual('usuarios')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Revisar</button>
              </div>
            )}
            <h1>Resumen General</h1>
          </div>
        ) : (
          <Usuarios />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirige la raíz al login o cárgalo directamente */}
        <Route path="/" element={<Login />} />
        
        {/* AGREGA ESTA LÍNEA: Ahora /login será una ruta válida */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/solicitar" element={<LoanApplication />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Opcional: Redirigir cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}