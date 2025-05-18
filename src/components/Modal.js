import React from 'react';
import '../App.css'; // Asegúrate de que los estilos del modal estén aquí o en un CSS específico

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Evitar que el clic se propague si ocurre en el overlay
    if (e.target.className === 'modal-overlay') {
      e.stopPropagation();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
