import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Clock, AlertCircle, CheckCircle2,
  History, CreditCard, PlusCircle, ArrowRight, X, Info, LogOut
} from 'lucide-react';

const API = 'https://fintechnova-api.onrender.com';

export default function UserDashboard() {
  const [prestamos, setPrestamos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Usuario';
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resPrestamos, resTransacciones] = await Promise.all([
        axios.get(`${API}/api/prestamos/usuario/${userId}`, { headers }),
        axios.get(`${API}/api/transacciones/usuario/${userId}`, { headers })
      ]);
      console.log("BBBBBBBBBBBBBBBBBBB: ", resPrestamos);
      setPrestamos(resPrestamos.data);
      setTransacciones(resTransacciones.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Cargando tu información...</p>
    </div>
  );

  const prestamo = prestamos[0] || null;
  const montoAprobado = Number(prestamo?.montoAprobado || 0);
  const saldoPendiente = Number(prestamo?.saldoPendiente || 0);
  const porcentajeProgreso = montoAprobado > 0 ? Math.min(((montoAprobado - saldoPendiente) / montoAprobado) * 100, 100) : 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.brand}>FintechNova</h1>
          <p style={styles.welcome}>Bienvenido, {userName}</p>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={styles.avatar} onClick={() => setShowUserMenu(!showUserMenu)}>
            {userName.charAt(0).toUpperCase()}
          </div>
          {showUserMenu && (
            <div style={styles.userMenu}>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SIN PRÉSTAMOS */}
      {!prestamo && (
        <div style={styles.emptyState}>
          <div style={styles.illustrationCircle}>
            <PlusCircle size={40} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>¡Bienvenido, {userName}!</h2>
          <p style={{ marginBottom: '25px', color: '#64748b' }}>No tienes préstamos activos en este momento.</p>
          <button onClick={() => navigate('/solicitar')} style={styles.ctaButton}>
            Solicitar un nuevo préstamo <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* PRÉSTAMO ACTIVO */}
      {prestamo && (
        <>
          <div style={styles.alertWarning}>
            <AlertCircle size={20} />
            <div><strong>Pago Próximo:</strong> Tu mensualidad vence pronto.</div>
          </div>

          <div style={styles.mainGrid}>
            {/* CARD PRÉSTAMO */}
            <div style={styles.loanCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={styles.badgeSuccess}><CheckCircle2 size={14} /> CRÉDITO ACTIVO</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>MONTO APROBADO</span>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>${montoAprobado.toLocaleString()}</p>
                </div>
              </div>
              <h2 style={styles.montoPrincipal}>${saldoPendiente.toLocaleString()}</h2>
              <p style={styles.subText}>Saldo pendiente por pagar</p>
              <div style={styles.progressContainer}>
                <div style={{ ...styles.progressBar, width: `${porcentajeProgreso}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                {porcentajeProgreso.toFixed(0)}% pagado
              </p>
            </div>

            {/* CARD ACCIONES */}
            <div style={styles.actionCard}>
              <div style={styles.iconCircle}><CreditCard size={20} color="#2563eb" /></div>
              <h3>Gestión de Pagos</h3>
              <div style={styles.buttonGroup}>
                <button onClick={() => navigate('/pagos')} style={styles.primaryBtn}>
                  Pagar Mensualidad
                </button>
                <button onClick={() => setShowCalendar(true)} style={styles.secondaryBtn}>
                  Ver Calendario
                </button>
                <button onClick={() => navigate('/solicitar')} style={styles.secondaryBtn}>
                  Nuevo Préstamo
                </button>
              </div>
            </div>
          </div>

          {/* RESUMEN */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Tasa de Interés</p>
              <p style={styles.summaryValue}>{Number(prestamo.tasaInteres).toFixed(1)}%</p>
            </div>
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Préstamos Activos</p>
              <p style={styles.summaryValue}>{prestamos.length}</p>
            </div>
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Transacciones</p>
              <p style={styles.summaryValue}>{transacciones.length}</p>
            </div>
          </div>
        </>
      )}

      {/* HISTORIAL DE TRANSACCIONES */}
      {transacciones.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={styles.sectionTitle}><History size={20} /> Historial de Movimientos</h3>
          <div style={styles.historyCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Concepto</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Monto</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map((t) => (
                  <tr key={t.idTransaccion}>
                    <td style={styles.td}>{t.tipoTransaccion}</td>
                    <td style={styles.td}>{t.fecha}</td>
                    <td style={styles.td}>${Number(t.monto).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge}>{t.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CALENDARIO */}
      {showCalendar && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Calendario de Pagos</h3>
              <button onClick={() => setShowCalendar(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.infoBox}>
                <Info size={18} color="#2563eb" />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Día de pago: <strong>Cada día 1</strong></p>
              </div>
              <div style={styles.calendarGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                  <div key={dia} style={{
                    ...styles.calendarDay,
                    background: dia === 1 ? '#2563eb' : '#f8fafc',
                    color: dia === 1 ? 'white' : '#64748b'
                  }}>{dia}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  brand: { fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 },
  welcome: { margin: 0, color: '#64748b', fontSize: '0.9rem' },
  avatar: { width: '40px', height: '40px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' },
  userMenu: { position: 'absolute', top: '50px', right: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '8px', zIndex: 100, width: '150px' },
  logoutBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: '600', borderRadius: '8px' },
  alertWarning: { display: 'flex', alignItems: 'center', gap: '15px', background: '#fff7ed', color: '#9a3412', border: '1px solid #ffedd5', padding: '20px', borderRadius: '16px', marginBottom: '20px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '20px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' },
  summaryCard: { background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' },
  summaryLabel: { margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: '600' },
  summaryValue: { margin: '8px 0 0 0', fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' },
  loanCard: { background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  badgeSuccess: { display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '15px' },
  montoPrincipal: { fontSize: '3.5rem', margin: '0 0 5px 0', letterSpacing: '-2px', fontWeight: '800' },
  subText: { color: '#64748b', fontSize: '0.95rem' },
  progressContainer: { height: '8px', background: '#f1f5f9', borderRadius: '10px', marginTop: '25px', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#2563eb', transition: 'width 1s ease-in-out' },
  actionCard: { background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' },
  iconCircle: { width: '45px', height: '45px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '25px' },
  primaryBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  secondaryBtn: { background: 'white', color: '#2563eb', border: '1.5px solid #e2e8f0', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  ctaButton: { background: '#10b981', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' },
  illustrationCircle: { width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '24px', width: '90%', maxWidth: '400px', overflow: 'hidden' },
  modalHeader: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: '#f8fafc', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' },
  modalContent: { padding: '20px' },
  infoBox: { background: '#eff6ff', padding: '12px', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' },
  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' },
  calendarDay: { height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '0.85rem' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '15px' },
  historyCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { textAlign: 'left', padding: '15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '15px', borderBottom: '1px solid #f1f5f9' },
  statusBadge: { background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }
};