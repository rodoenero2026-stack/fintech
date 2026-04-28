import { CheckCircle, Clock3, AlertTriangle, TrendingUp } from 'lucide-react';

export const StatusBadge = ({ estado }) => {
  const config = {
    'Verificado': { class: 'badge-verified', icon: CheckCircle },
    'Pendiente': { class: 'badge-pending', icon: Clock3 },
    'Aprobado': { class: 'badge-approved', icon: TrendingUp },
    'Rechazado': { class: 'badge-rejected', icon: AlertTriangle },
    'Completado': { class: 'badge-verified', icon: CheckCircle }
  };
  const s = config[estado] || config['Pendiente'];
  const Icon = s.icon;
  return <span className={`badge-pill ${s.class}`}><Icon size={12}/> {estado}</span>
};