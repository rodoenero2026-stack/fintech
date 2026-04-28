import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerDatosUsuario, registrarPagoApi } from '../simulatedApi';
import { CreditCard, ArrowLeft, AlertCircle, Zap } from 'lucide-react';

export default function Pagos() {
  const navigate = useNavigate();
  const user = obtenerDatosUsuario();
  const [procesando, setProcesando] = useState(false);
  
  // Estado para el apartado de confirmación integrado
  const [confirmacion, setConfirmacion] = useState(null); 

  // --- Lógica Financiera ---
  const montoBase = Number(user.montoSolicitado || 0);
  const meses = Number(user.meses || 1);
  const calcularTasa = (m) => (m <= 3 ? 0.05 : m <= 6 ? 0.12 : m <= 12 ? 0.25 : 0.40);
  
  const totalConInteres = montoBase * (1 + calcularTasa(meses));
  const montoPagadoActual = user.montoPagado || 0;
  const saldoPendiente = totalConInteres - montoPagadoActual;

  // Prepara la sección de confirmación
  const prepararTransaccion = (tipo) => {
    let monto = 0;
    let descripcion = "";

    if (tipo === 'mensualidad') {
      monto = 350; // Monto de ejemplo para la cuota
      descripcion = "Estás por pagar tu cuota mensual programada.";
    } else if (tipo === 'liquidar') {
      monto = saldoPendiente;
      descripcion = "Estás por liquidar el total de tu deuda actual. Esto cerrará el crédito.";
    }

    setConfirmacion({ tipo, monto, descripcion });
  };

  const ejecutarPago = () => {
  if (!confirmacion) return;
  
  setProcesando(true);
  
  // Llamada directa (síncrona) al API corregido
  const exito = registrarPagoApi(confirmacion.tipo, confirmacion.monto);
  
  if (exito) {
    // Simulamos un pequeño retraso visual de medio segundo
    setTimeout(() => {
      setProcesando(false);
      alert(confirmacion.tipo === 'liquidar' ? "¡Crédito Liquidado!" : "Pago realizado correctamente.");
      navigate('/dashboard');
    }, 600);
  } else {
    setProcesando(false);
    alert("Error: No se pudo conectar con la base de datos local.");
  }
};

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <ArrowLeft size={18} /> Volver al Panel
      </button>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1e293b', margin: '0 0 8px 0' }}>Gestionar mi Crédito</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Saldo Pendiente: <strong style={{color: '#2563eb'}}>${saldoPendiente.toLocaleString()}</strong>
        </p>
      </div>

      {/* --- BOTONES DE SELECCIÓN --- */}
      <div style={styles.buttonGrid}>
        <button 
          onClick={() => prepararTransaccion('mensualidad')} 
          style={{
            ...styles.btnOption, 
            borderColor: confirmacion?.tipo === 'mensualidad' ? '#2563eb' : '#e2e8f0',
            background: confirmacion?.tipo === 'mensualidad' ? '#f0f7ff' : 'white'
          }}
        >
          <CreditCard size={24} color="#2563eb" />
          <span>Pagar Mensualidad</span>
        </button>
        
        <button 
          onClick={() => prepararTransaccion('liquidar')} 
          style={{
            ...styles.btnOption, 
            borderColor: confirmacion?.tipo === 'liquidar' ? '#ef4444' : '#e2e8f0',
            background: confirmacion?.tipo === 'liquidar' ? '#fef2f2' : 'white'
          }}
        >
          <Zap size={24} color="#ef4444" />
          <span>Liquidar Total</span>
        </button>
      </div>

      {/* --- APARTADO DE CONFIRMACIÓN --- */}
      {confirmacion && (
        <div style={styles.confirmSection} className="fade-in">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
            <AlertCircle size={18} color={confirmacion.tipo === 'liquidar' ? '#ef4444' : '#2563eb'} />
            <strong style={{fontSize: '0.9rem'}}>Confirmar Transacción</strong>
          </div>
          
          <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '20px'}}>{confirmacion.descripcion}</p>
          
          <div style={styles.receipt}>
            <span style={{color: '#64748b', fontSize: '0.9rem'}}>Total a pagar:</span>
            <span style={styles.receiptMonto}>${confirmacion.monto.toLocaleString()}</span>
          </div>

          <button 
            disabled={procesando} 
            onClick={ejecutarPago} 
            style={confirmacion.tipo === 'liquidar' ? styles.btnFinalLiquidar : styles.btnFinalPago}
          >
            {procesando ? "Procesando..." : `Confirmar y Pagar`}
          </button>
          
          <button onClick={() => setConfirmacion(null)} style={styles.btnCancelar}>
            Elegir otra opción
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '30px', fontSize: '0.9rem' },
  buttonGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' },
  btnOption: { 
    border: '2px solid #e2e8f0', padding: '25px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', 
    fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease', color: '#1e293b'
  },
  confirmSection: { 
    background: '#f8fafc', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', 
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease'
  },
  receipt: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px 0', 
    padding: '15px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' 
  },
  receiptMonto: { fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' },
  btnFinalPago: { width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  btnFinalLiquidar: { width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  btnCancelar: { width: '100%', background: 'transparent', color: '#64748b', border: 'none', padding: '15px', cursor: 'pointer', fontSize: '0.85rem' }
};