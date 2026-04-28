import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitarPrestamoApi } from '../simulatedApi';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';

export default function LoanApplication() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    monto: 1000,
    meses: 3,
    direccion: '',
    numeroCasa: '',
    codigoPostal: '', 
    estado: '',
    celular: '',
    curp: '',          
    ingresos: '',
    diaPago: 1, // Valor por defecto
    fotoIne: null
  });

  // Cálculos de intereses
  const calcularInteres = (meses) => {
    const m = Number(meses);
    if (m === 3) return 0.05; 
    if (m === 6) return 0.12; 
    if (m === 12) return 0.25; 
    return 0.40; 
  };

  const interesActual = calcularInteres(formData.meses);
  const totalAPagar = Number(formData.monto) * (1 + interesActual);
  const cuotaMensual = totalAPagar / Number(formData.meses);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para finalizar corregida para sincronizar con el Dashboard
 const finalizarSolicitud = async () => {
    setLoading(true);
    
    const solicitudFinal = {
      ...formData,
      nombre: "Joan Francisco", 
      // IMPORTANTE: Mapeamos 'monto' a 'montoSolicitado' para que el Dashboard lo reconozca
      montoSolicitado: formData.monto, 
      statusSolicitud: 'pendiente', // Usar 'statusSolicitud' en lugar de solo 'status'
      fechaSolicitud: new Date().toISOString(),
      montoPagado: 0,
      historial: []
    };

    try {
      await solicitarPrestamoApi(solicitudFinal);
      
      // Sincronización manual por si la API falla en disparar el evento
      localStorage.setItem('fintech_nova_v1', JSON.stringify(solicitudFinal));
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Error en API:", error);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => paso === 1 ? navigate('/dashboard') : setPaso(1)} style={styles.backBtn}>
        <ArrowLeft size={18} /> Volver
      </button>

      <div style={styles.card}>
        {/* Indicador de Pasos */}
        <div style={styles.stepper}>
          <div style={{...styles.step, color: paso >= 1 ? '#2563eb' : '#94a3b8'}}>1. Configuración</div>
          <div style={{...styles.line, background: paso === 2 ? '#2563eb' : '#e2e8f0'}}></div>
          <div style={{...styles.step, color: paso === 2 ? '#2563eb' : '#94a3b8'}}>2. Datos Personales</div>
        </div>

        {paso === 1 ? (
          <div className="fade-in">
            <h2 style={styles.title}>Configura tu préstamo</h2>
            <p style={styles.subtitle}>Elige el monto y el plazo que mejor se adapte a ti.</p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>¿Cuánto dinero necesitas?</label>
              <input 
                type="number" 
                name="monto"
                value={formData.monto}
                onChange={manejarCambio}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Plazo para pagar</label>
              <select name="meses" value={formData.meses} onChange={manejarCambio} style={styles.input}>
                <option value="3">3 meses (5% interés)</option>
                <option value="6">6 meses (12% interés)</option>
                <option value="12">12 meses (25% interés)</option>
                <option value="24">24 meses (40% interés)</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Día preferido de pago</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                {[1, 11, 24].map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => setFormData({ ...formData, diaPago: dia })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: formData.diaPago === dia ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: formData.diaPago === dia ? '#eff6ff' : 'white',
                      color: formData.diaPago === dia ? '#2563eb' : '#64748b',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Día {dia}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Total con intereses:</span>
                <strong>${totalAPagar.toLocaleString()}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Cuota mensual:</span>
                <strong style={{color: '#2563eb'}}>${cuotaMensual.toLocaleString(undefined, {maximumFractionDigits: 2})} / mes</strong>
              </div>
            </div>

            <button onClick={() => setPaso(2)} style={styles.nextBtn}>
              Siguiente paso <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="fade-in">
            <h2 style={styles.title}>Información Personal</h2>
            <p style={styles.subtitle}>Casi terminamos, completa tu perfil.</p>
            
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>CURP</label>
                <input type="text" name="curp" onChange={manejarCambio} style={styles.input} placeholder="18 caracteres" maxLength={18} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Código Postal</label>
                <input type="number" name="codigoPostal" onChange={manejarCambio} style={styles.input} placeholder="C.P." />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Dirección</label>
                <input type="text" name="direccion" onChange={manejarCambio} style={styles.input} placeholder="Calle y Colonia" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Núm. Casa</label>
                <input type="text" name="numeroCasa" onChange={manejarCambio} style={styles.input} placeholder="Ej. 12" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Estado</label>
                <input type="text" name="estado" onChange={manejarCambio} style={styles.input} placeholder="Ej. Chiapas" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Celular</label>
                <input type="tel" name="celular" onChange={manejarCambio} style={styles.input} placeholder="10 dígitos" />
              </div>

              <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                <label style={styles.label}>Ingreso Mensual Libre (MXN)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span>
                  <input 
                    type="number" 
                    name="ingresos" 
                    onChange={manejarCambio} 
                    style={{ ...styles.input, paddingLeft: '30px' }} 
                    placeholder="Ej. 12000" 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Identificación Oficial (INE)</label>
              <div style={styles.dropzone}>
                <Upload size={24} color="#94a3b8" />
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Sube tu identificación para validar</p>
              </div>
            </div>

            <button 
              onClick={finalizarSolicitud} 
              style={{...styles.nextBtn, background: '#059669', marginTop: '20px'}}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Finalizar Solicitud'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  backBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' },
  card: { background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' },
  stepper: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '40px' },
  step: { fontSize: '0.85rem', fontWeight: 'bold' },
  line: { width: '40px', height: '2px' },
  title: { margin: '0 0 10px', fontSize: '1.5rem', color: '#1e293b' },
  subtitle: { margin: '0 0 30px', color: '#64748b', fontSize: '0.95rem' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  summaryBox: { background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '30px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  nextBtn: { width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  dropzone: { border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }
};