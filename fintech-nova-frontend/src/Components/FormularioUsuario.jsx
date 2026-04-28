import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export const FormularioUsuarioModal = ({ isOpen, onClose, onAddUsuario }) => {
  // Estado local para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Lógica para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página
    setError('');

    // Validación básica
    if (!nombre || !email) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!email.includes('@')) {
      setError('El formato del email no es válido.');
      return;
    }

    // Crea el objeto del nuevo usuario (simulando datos de la DB)
    const nuevoUsuario = {
      id: Date.now(), // ID temporal único
      nombre: nombre,
      email: email,
      kyc: "Pendiente", // Por defecto
      registro: new Date().toISOString().split('T')[0] // Fecha actual
    };

    // Envía el usuario al componente padre (Usuarios.jsx)
    onAddUsuario(nuevoUsuario);

    // Limpia el formulario y cierra el modal
    setNombre('');
    setEmail('');
    onClose();
  };

  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <header className="modal-header">
          <div className="modal-title">
            <UserPlus size={22} className="text-blue" />
            <h2>Registrar Nuevo Cliente</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="form-error">{error}</p>}
          
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ej. juan.perez@email.com"
            />
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} /> Crear Usuario
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};