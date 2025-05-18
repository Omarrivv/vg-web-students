import Swal from 'sweetalert2';

export const showSuccessAlert = (message) => {
    Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1890ff'
    });
};

export const showErrorAlert = (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1890ff'
    });
};

export const showConfirmDialog = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1890ff',
        cancelButtonColor: '#ff4d4f',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    });
}; 