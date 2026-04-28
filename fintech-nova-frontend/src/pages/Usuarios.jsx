import React, { useState, useEffect } from 'react';
import { decidirPrestamo, obtenerDatosUsuario } from '../simulatedApi';
// CORRECCIÓN: Se cambió 'lucide-center' por 'lucide-react'
import { Check, X, Eye, DollarSign, MapPin, Phone, FileText, User } from "lucide-react";

const Usuarios = () => {
  const [userFrein, setUserFrein] = useState(obtenerDatosUsuario());
  const [verDetalles, setVerDetalles] = useState(false);

  useEffect(() => {
    const actualizar = () => setUserFrein(obtenerDatosUsuario());
    window.addEventListener('storage', actualizar);
    return () => window.removeEventListener('storage', actualizar);
  }, []);

  const manejarDecision = (id, decision) => {
  try {
    // Estructura base garantizada
    let db = {
      nombreCliente: "Joan Francisco",
      montoSolicitado: 1500, // Monto por defecto si algo falla
      montoPagado: 0,
      statusSolicitud: 'pendiente',
      historial: []
    };

    // Intentar leer datos existentes si los hay
    const datosGuardados = localStorage.getItem('fintech_db');
    if (datosGuardados) {
      db = { ...db, ...JSON.parse(datosGuardados) };
    }

    if (decision === 'acreditar') {
      db.statusSolicitud = 'aprobado';
      db.montoPagado = 0;
      db.historial = [
        {
          id: Date.now(),
          concepto: 'Apertura de Crédito',
          fecha: new Date().toLocaleDateString(),
          monto: db.montoSolicitado,
          tipo: 'abono'
        }
      ];
      alert("✅ Crédito Acreditado correctamente");
    } else {
      db.statusSolicitud = 'ninguna';
      db.montoSolicitado = 0;
      db.historial = [];
      alert("❌ Solicitud Denegada");
    }

    localStorage.setItem('fintech_db', JSON.stringify(db));
    
    // Forzar recarga para que el Admin vea que ya no hay pendientes
    window.location.reload(); 

  } catch (error) {
    console.error("Error en Admin:", error);
    alert("Error técnico al procesar.");
  }
};

<button 
  onClick={() => manejarDecision('id_usuario', 'acreditar')}
  className="btn-acreditar"
>
  Acreditar
</button>

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '30px', fontSize: '1.8rem' }}>Gestión de Solicitudes</h1>
      
      <div style={styles.cardContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={{ ...styles.th, width: '25%' }}>SOLICITANTE</th>
              <th style={{ ...styles.th, width: '15%' }}>MONTO</th>
              <th style={{ ...styles.th, width: '15%' }}>ESTADO</th>
              <th style={{ ...styles.th, width: '15%' }}>EXPEDIENTE</th>
              <th style={{ ...styles.th, width: '30%' }}>DECISIÓN FINAL</th>
            </tr>
          </thead>
          <tbody>
            {/* Convertimos a Number para asegurar la comparación y añadimos validación de existencia */}
            {userFrein && Number(userFrein.montoSolicitado) > 0 ? (
              <tr style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>{userFrein.nombre || "Usuario"}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Recibido: Hoy</div>
                </td>
                <td style={{ ...styles.td, fontWeight: '700', color: '#334155' }}>
                  ${Number(userFrein.montoSolicitado).toLocaleString()}
                </td>
                <td style={styles.td}>
                  <span style={badgeStyle(userFrein.statusSolicitud || 'pendiente')}>
                    {(userFrein.statusSolicitud || 'pendiente').toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => setVerDetalles(true)} style={styles.viewBtn}>
                    <Eye size={16} /> Detalles
                  </button>
                </td>
                <td style={styles.td}>
                  {userFrein.statusSolicitud === 'pendiente' ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => manejarDecision('aprobar')} style={styles.approveBtn}>
                        <Check size={18} /> Acreditar
                      </button>
                      <button onClick={() => manejarDecision('rechazar')} style={styles.rejectBtn}>
                        <X size={18} /> Denegar
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                      Proceso finalizado
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              /* Mensaje informativo si no hay solicitudes para que la tabla no se vea vacía */
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No hay solicitudes de préstamo pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {verDetalles && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Expediente del Cliente</h3>
              <button onClick={() => setVerDetalles(false)} style={styles.closeBtn}>&times;</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.infoGrid}>
                <DetailSection title="Identidad Legal" icon={<User size={18}/>}>
                  <p><strong>CURP:</strong> {userFrein.curp || 'No proporcionada'}</p>
                </DetailSection>

                <DetailSection title="Crédito Solicitado" icon={<DollarSign size={18}/>}>
                  <p><strong>Monto base:</strong> ${Number(userFrein.montoSolicitado).toLocaleString()}</p>
                  <p><strong>Plazo:</strong> {userFrein.meses} meses</p>
                  <p><strong>Día de pago mensual:</strong> Cada día {userFrein.diaPago || 'No seleccionado'}</p>
                  <p><strong>Tasa de Interés:</strong> {
                    userFrein.meses == 3 ? '5%' : 
                    userFrein.meses == 6 ? '12%' : 
                    userFrein.meses == 12 ? '25%' : '40%'
                  }</p>

                  <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Total a devolver:</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
                      ${(Number(userFrein.montoSolicitado) * (
                        1 + (userFrein.meses == 3 ? 0.05 : 
                             userFrein.meses == 6 ? 0.12 : 
                             userFrein.meses == 12 ? 0.25 : 0.40)
                      )).toLocaleString()} MXN
                    </p>
                  </div>
                </DetailSection>

                <DetailSection title="Ubicación" icon={<MapPin size={18}/>}>
                  <p><strong>Dirección:</strong> {userFrein.direccion} #{userFrein.numeroCasa}</p>
                  <p><strong>C.P.:</strong> {userFrein.codigoPostal}</p>
                  <p><strong>Estado:</strong> {userFrein.estado}</p>
                </DetailSection>

                <DetailSection title="Contacto e Ingresos" icon={<Phone size={18}/>}>
                  <p><strong>Celular:</strong> {userFrein.celular}</p>
                  <p><strong>Ingresos:</strong> ${userFrein.ingresos} / mes</p>
                </DetailSection>

                <DetailSection title="Documentación" icon={<FileText size={18}/>}>
                  <div style={styles.docBox}>
                    <Check size={14} color="#10b981" /> INE Frontal cargada
                  </div>
                </DetailSection>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setVerDetalles(false)} style={styles.modalCloseBtn}>
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailSection = ({ title, icon, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', margin: '0 0 10px 0', fontSize: '0.95rem' }}>
      {icon} {title}
    </h4>
    <div style={{ paddingLeft: '28px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
      {children}
    </div>
  </div>
);

const styles = {
  cardContainer: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  th: { padding: '18px 24px', textAlign: 'left', background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  viewBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', color: '#475569', fontWeight: '600', transition: '0.2s' },
  approveBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: '0.2s' },
  rejectBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#ef4444', border: '1px solid #fee2e2', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: '0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', width: '90%', maxWidth: '550px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflowY: 'auto', maxHeight: '90vh' },
  modalHeader: { padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' },
  modalBody: { padding: '24px' },
  docBox: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' },
  modalFooter: { padding: '20px', background: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', textAlign: 'right' },
  modalCloseBtn: { background: '#1e293b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
};

const badgeStyle = (status) => ({
  padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800',
  background: status === 'pendiente' ? '#eff6ff' : status === 'aprobado' ? '#dcfce7' : '#fef2f2',
  color: status === 'pendiente' ? '#2563eb' : status === 'aprobado' ? '#166534' : '#991b1b',
  border: `1px solid ${status === 'pendiente' ? '#bfdbfe' : status === 'aprobado' ? '#bbf7d0' : '#fecaca'}`
});

export default Usuarios;