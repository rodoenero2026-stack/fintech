import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Upload, Clock, CheckCircle2 } from 'lucide-react';

const API = 'https://fintechnova-api.onrender.com';

export default function LoanApplication() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1=config, 2=datos, 3=esperando
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Usuario';
  const headers = { Authorization: `Bearer ${token}` };

  const [formData, setFormData] = useState({
    monto: 1000,
    meses: 3,
    curp: '',
    ine: '',
    reciboLuzAgua: '',
    comprobanteIngresos: '',
    estadoCuenta: '',
    diaPago: 1
  });

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

  const finalizarSolicitud = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/prestamos/simular`, {
        idUsuario: Number(userId),
        monto: Number(formData.monto),
        meses: Number(formData.meses),
        cURP: formData.curp,
        iNE: formData.ine,
        reciboLuzAgua: formData.reciboLuzAgua,
        comprobanteIngresos: formData.comprobanteIngresos,
        estadoCuenta: formData.estadoCuenta
      }, { headers });

      setPaso(3); // Ir a pantalla de espera
    } catch (err) {
      setError('❌ Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 3 — Pantalla de espera
  if (paso === 3) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.waitingContainer}>
            <div style={styles.clockCircle}>
              <Clock size={48} color="#2563eb" />
            </div>
            <h2 style={styles.title}>¡Solicitud Enviada!</h2>
            <p style={styles.subtitle}>
              Hola <strong>{userName}</strong>, tu solicitud de <strong>${Number(formData.monto).toLocaleString()}</strong> está siendo revisada por nuestro equipo.
            </p>

            <div style={styles.stepsWaiting}>
              <div style={styles.stepWaiting}>
                <CheckCircle2 size={20} color="#10b981" />
                <span>Solicitud recibida</span>
              </div>
              <div style={styles.stepWaiting}>
                <Clock size={20} color="#2563eb" />
                <span style={{ color: '#2563eb', fontWeight: '600' }}>Revisión en proceso...</span>
              </div>
              <div style={{ ...styles.stepWaiting, opacity: 0.4 }}>
                <Clock size={20} color="#94a3b8" />
                <span>Préstamo aprobado</span>
              </div>
            </div>

            <div style={styles.infoBox}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af' }}>
                ⏱ El proceso de aprobación puede tomar entre <strong>24 y 48 horas hábiles</strong>. Te notificaremos cuando haya una actualización.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => navigate('/dashboard')} style={styles.primaryBtn}>
                Ver mi Dashboard
              </button>
              <button onClick={() => { setPaso(1); setFormData({ monto: 1000, meses: 3, curp: '', ine: '', reciboLuzAgua: '', comprobanteIngresos: '', estadoCuenta: '', diaPago: 1 }); }} style={styles.secondaryBtn}>
                Nueva Solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => paso === 1 ? navigate('/dashboard') : setPaso(1)} style={styles.backBtn}>
        <ArrowLeft size={18} /> Volver
      </button>

      <div style={styles.card}>
        {/* Stepper */}
        <div style={styles.stepper}>
          <div style={{ ...styles.step, color: paso >= 1 ? '#2563eb' : '#94a3b8' }}>1. Configuración</div>
          <div style={{ ...styles.line, background: paso === 2 ? '#2563eb' : '#e2e8f0' }}></div>
          <div style={{ ...styles.step, color: paso === 2 ? '#2563eb' : '#94a3b8' }}>2. Documentos</div>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

        {/* PASO 1 */}
        {paso === 1 && (
          <div>
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
                min="500"
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
                      flex: 1, padding: '12px', borderRadius: '12px',
                      border: formData.diaPago === dia ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: formData.diaPago === dia ? '#eff6ff' : 'white',
                      color: formData.diaPago === dia ? '#2563eb' : '#64748b',
                      fontWeight: 'bold', cursor: 'pointer'
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
                <strong style={{ color: '#2563eb' }}>${cuotaMensual.toLocaleString(undefined, { maximumFractionDigits: 2 })} / mes</strong>
              </div>
            </div>

            <button onClick={() => setPaso(2)} style={styles.nextBtn}>
              Siguiente paso <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div>
            <h2 style={styles.title}>Documentación</h2>
            <p style={styles.subtitle}>Ingresa tu información y documentos requeridos.</p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CURP</label>
              <input type="text" name="curp" value={formData.curp} onChange={manejarCambio} style={styles.input} placeholder="18 caracteres" maxLength={18} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>INE (número)</label>
              <input type="text" name="ine" value={formData.ine} onChange={manejarCambio} style={styles.input} placeholder="Número de INE" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Recibo de Luz/Agua</label>
              <input type="text" name="reciboLuzAgua" value={formData.reciboLuzAgua} onChange={manejarCambio} style={styles.input} placeholder="Ej. CFE-2026-001" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Comprobante de Ingresos</label>
              <input type="text" name="comprobanteIngresos" value={formData.comprobanteIngresos} onChange={manejarCambio} style={styles.input} placeholder="Ej. Nómina-Marzo-2026" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Estado de Cuenta</label>
              <input type="text" name="estadoCuenta" value={formData.estadoCuenta} onChange={manejarCambio} style={styles.input} placeholder="Ej. Banamex-2026-Q1" />
            </div>

            <button
              onClick={finalizarSolicitud}
              style={{ ...styles.nextBtn, background: '#059669' }}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Finalizar Solicitud'}
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
  waitingContainer: { textAlign: 'center', padding: '20px 0' },
  clockCircle: { width: '90px', height: '90px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  stepsWaiting: { display: 'flex', flexDirection: 'column', gap: '15px', margin: '30px auto', maxWidth: '280px', textAlign: 'left' },
  stepWaiting: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#475569' },
  infoBox: { background: '#eff6ff', padding: '16px', borderRadius: '12px', margin: '20px 0', textAlign: 'left' },
  primaryBtn: { flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  secondaryBtn: { flex: 1, background: 'white', color: '#2563eb', border: '1.5px solid #e2e8f0', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};