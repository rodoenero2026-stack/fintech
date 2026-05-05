import React, { useState, useEffect } from 'react';
import { Check, X, Eye, DollarSign, FileText, User } from "lucide-react";
import axios from 'axios';

const API = 'https://fintechnova-api.onrender.com';

const Usuarios = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [verDetalles, setVerDetalles] = useState(null);
  const [vistaTab, setVistaTab] = useState('solicitudes');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resSolicitudes, resUsuarios] = await Promise.all([
        axios.get(`${API}/api/solicitudes`, { headers }),
        axios.get(`${API}/api/usuarios`, { headers })
      ]);
      setSolicitudes(resSolicitudes.data);
      setUsuarios(resUsuarios.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const manejarDecision = async (idSolicitud, estado) => {
    try {
      await axios.put(`${API}/api/solicitudes/${idSolicitud}/estado`,
        { estado },
        { headers }
      );
      alert(estado === 'PROCESADA' ? '✅ Solicitud Procesada' : '❌ Solicitud Rechazada');
      cargarDatos();
    } catch (err) {
      alert('Error al procesar la decisión');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '1.8rem' }}>Panel de Administración</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setVistaTab('solicitudes')}
          style={{ ...tabStyle, background: vistaTab === 'solicitudes' ? '#2563eb' : 'white', color: vistaTab === 'solicitudes' ? 'white' : '#64748b' }}
        >
          Solicitudes de Préstamo
        </button>
        <button
          onClick={() => setVistaTab('usuarios')}
          style={{ ...tabStyle, background: vistaTab === 'usuarios' ? '#2563eb' : 'white', color: vistaTab === 'usuarios' ? 'white' : '#64748b' }}
        >
          Usuarios Registrados
        </button>
        <button
          onClick={() => setVistaTab('prestamos')}
          style={{ ...tabStyle, background: vistaTab === 'prestamos' ? '#2563eb' : 'white', color: vistaTab === 'prestamos' ? 'white' : '#64748b' }}
        >
          Préstamos Activos
        </button>
      </div>

      {/* TABLA SOLICITUDES */}
      {vistaTab === 'solicitudes' && (
        <div style={styles.cardContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SOLICITANTE</th>
                <th style={styles.th}>MONTO</th>
                <th style={styles.th}>PLAZO</th>
                <th style={styles.th}>ESTADO</th>
                <th style={styles.th}>DOCUMENTOS</th>
                <th style={styles.th}>DECISIÓN</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No hay solicitudes registradas.
                  </td>
                </tr>
              ) : (
                solicitudes.map(s => (
                  <tr key={s.idSolicitud}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>{s.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {s.idUsuario}</div>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700' }}>${Number(s.montoSolicitado).toLocaleString()}</td>
                    <td style={styles.td}>{s.plazoMeses} meses</td>
                    <td style={styles.td}>
                      <span style={badgeStyle(s.estado)}>{s.estado}</span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => setVerDetalles(s)} style={styles.viewBtn}>
                        <Eye size={16} /> Ver
                      </button>
                    </td>
                    <td style={styles.td}>
                      {s.estado !== 'PROCESADA' && s.estado !== 'RECHAZADA' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => manejarDecision(s.idSolicitud, 'PROCESADA')} style={styles.approveBtn}>
                            <Check size={16} /> Procesar
                          </button>
                          <button onClick={() => manejarDecision(s.idSolicitud, 'RECHAZADA')} style={styles.rejectBtn}>
                            <X size={16} /> Rechazar
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA USUARIOS */}
      {vistaTab === 'usuarios' && (
        <div style={styles.cardContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>NOMBRE</th>
                <th style={styles.th}>EMAIL</th>
                <th style={styles.th}>ROL</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.idUsuario}>
                    <td style={styles.td}>{u.idUsuario}</td>
                    <td style={{ ...styles.td, fontWeight: '700' }}>{u.nombre}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={badgeStyle(u.rol === 'admin' ? 'PROCESADA' : 'PENDIENTE')}>
                        {u.rol.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA PRESTAMOS */}
      {vistaTab === 'prestamos' && (
        <PrestamosTab headers={headers} />
      )}

      {/* MODAL DETALLES */}
      {verDetalles && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Expediente — {verDetalles.nombre}</h3>
              <button onClick={() => setVerDetalles(null)} style={styles.closeBtn}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              <DetailSection title="Identidad Legal" icon={<User size={18} />}>
                <p><strong>CURP:</strong> {verDetalles.curp || 'No proporcionada'}</p>
                <p><strong>INE:</strong> {verDetalles.ine || 'No proporcionada'}</p>
              </DetailSection>
              <DetailSection title="Crédito Solicitado" icon={<DollarSign size={18} />}>
                <p><strong>Monto:</strong> ${Number(verDetalles.montoSolicitado).toLocaleString()}</p>
                <p><strong>Plazo:</strong> {verDetalles.plazoMeses} meses</p>
              </DetailSection>
              <DetailSection title="Documentación" icon={<FileText size={18} />}>
                <p><strong>Recibo luz/agua:</strong> {verDetalles.reciboLuzAgua || 'No proporcionado'}</p>
                <p><strong>Comprobante ingresos:</strong> {verDetalles.comprobanteIngresos || 'No proporcionado'}</p>
                <p><strong>Estado de cuenta:</strong> {verDetalles.estadoCuenta || 'No proporcionado'}</p>
              </DetailSection>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setVerDetalles(null)} style={styles.modalCloseBtn}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PrestamosTab = ({ headers }) => {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    axios.get('https://fintechnova-api.onrender.com/api/prestamos', { headers })
      .then(res => setPrestamos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.cardContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID PRÉSTAMO</th>
            <th style={styles.th}>ID USUARIO</th>
            <th style={styles.th}>MONTO APROBADO</th>
            <th style={styles.th}>SALDO PENDIENTE</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                No hay préstamos registrados.
              </td>
            </tr>
          ) : (
            prestamos.map(p => (
              <tr key={p.idPrestamo}>
                <td style={styles.td}>{p.idPrestamo}</td>
                <td style={styles.td}>{p.idUsuario}</td>
                <td style={{ ...styles.td, fontWeight: '700' }}>${Number(p.montoAprobado).toLocaleString()}</td>
                <td style={{ ...styles.td, color: '#ef4444', fontWeight: '700' }}>${Number(p.saldoPendiente).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const DetailSection = ({ title, icon, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', margin: '0 0 10px 0' }}>
      {icon} {title}
    </h4>
    <div style={{ paddingLeft: '28px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
      {children}
    </div>
  </div>
);

const tabStyle = {
  padding: '10px 20px',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600'
};

const styles = {
  cardContainer: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '18px 24px', textAlign: 'left', background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '16p