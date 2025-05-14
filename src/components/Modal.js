import React from 'react';
import '../App.css'; // Asegúrate de que los estilos del modal estén aquí o en un CSS específico

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Cierra al hacer clic fuera */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Evita que el clic dentro cierre el modal */}
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
