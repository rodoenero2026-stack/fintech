import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

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
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: '260px', background: '#1e293b', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>FintechNova Admin</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '30px' }}>{userName}</p>
        <nav>
          <button onClick={() => setVistaActual('dashboard')} style={navBtnStyle(vistaActual === 'dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setVistaActual('usuarios')} style={navBtnStyle(vistaActual === 'usuarios')}>
            <Users size={20} /> Gestión
          </button>
          <button onClick={handleLogout} style={{ ...navBtnStyle(false), marginTop: '20px', color: '#ef4444' }}>
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '30px' }}>
        {vistaActual === 'dashboard' ? (
          <div>
            <h1>Resumen General</h1>
            <p style={{ color: '#64748b' }}>Selecciona "Gestión" para ver usuarios, solicitudes y préstamos.</p>
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
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/solicitar" element={<LoanApplication />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/pagos" element={<Pagos />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}