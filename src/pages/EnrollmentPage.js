import React, { useState, useEffect } from 'react';
import { getAllEnrollments, getEnrollmentById, getEnrollmentsByStudent, getEnrollmentsByClassroom, getEnrollmentsByStatus, getEnrollmentsByYear, getEnrollmentsByPeriod, getEnrollmentsByStudentAndStatus, getEnrollmentsByClassroomAndStatus, createEnrollment, updateEnrollment, deleteEnrollment } from '../services/enrollmentService';
import Modal from '../components/Modal';
import EnrollmentForm from '../components/EnrollmentForm';
import EnrollmentFilters from '../components/EnrollmentFilters';
import '../App.css';

function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Nueva función para filtrar
  const handleFilter = async (filters) => {
    setLoading(true);
    setError(null);
    setFeedbackMessage('');
    try {
      if (filters.enrollmentId) {
        // Buscar por ID
        const res = await getEnrollmentById(filters.enrollmentId);
        setEnrollments(res.data ? [res.data] : []);
      } else if (filters.studentId && filters.status) {
        // Filtrar por estudiante y estado
        const res = await getEnrollmentsByStudentAndStatus(filters.studentId, filters.status);
        setEnrollments(res.data);
      } else if (filters.classroomId && filters.status) {
        // Filtrar por aula y estado
        const res = await getEnrollmentsByClassroomAndStatus(filters.classroomId, filters.status);
        setEnrollments(res.data);
      } else if (filters.studentId) {
        // Filtrar por estudiante
        const res = await getEnrollmentsByStudent(filters.studentId);
        setEnrollments(res.data);
      } else if (filters.classroomId) {
        // Filtrar por aula
        const res = await getEnrollmentsByClassroom(filters.classroomId);
        setEnrollments(res.data);
      } else if (filters.status) {
        // Filtrar por estado
        const res = await getEnrollmentsByStatus(filters.status);
        setEnrollments(res.data);
      } else if (filters.enrollmentYear) {
        // Filtrar por año
        const res = await getEnrollmentsByYear(filters.enrollmentYear);
        setEnrollments(res.data);
      } else if (filters.enrollmentPeriod) {
        // Filtrar por periodo
        const res = await getEnrollmentsByPeriod(filters.enrollmentPeriod);
        setEnrollments(res.data);
      } else {
        // Todos
        fetchEnrollments();
      }
    } catch (err) {
      setError('Error al filtrar matrículas.');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar matrículas
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await getAllEnrollments();
      setEnrollments(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las matrículas. Asegúrate de que el backend esté corriendo en http://localhost:8081.');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Abrir modal para crear o editar
  const handleOpenModal = (enrollment = null) => {
    setEditingEnrollment(enrollment);
    setIsModalOpen(true);
    setFeedbackMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEnrollment(null);
  };

  // Crear matrícula
  const handleCreateEnrollment = async (enrollmentData) => {
    try {
      setLoading(true);
      await createEnrollment(enrollmentData);
      setFeedbackMessage('Matrícula creada con éxito!');
      handleCloseModal();
      fetchEnrollments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear la matrícula.';
      setFeedbackMessage(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar matrícula
  const handleUpdateEnrollment = async (enrollmentData) => {
    if (!editingEnrollment?.id) return;
    try {
      setLoading(true);
      await updateEnrollment(editingEnrollment.id, enrollmentData);
      setFeedbackMessage('Matrícula actualizada con éxito!');
      handleCloseModal();
      fetchEnrollments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar la matrícula.';
      setFeedbackMessage(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar matrícula
  const handleDeleteEnrollment = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta matrícula?')) {
      try {
        setLoading(true);
        await deleteEnrollment(id);
        setFeedbackMessage('Matrícula eliminada con éxito!');
        fetchEnrollments();
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al eliminar la matrícula.';
        setFeedbackMessage(errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Determina qué función de submit usar (crear o actualizar)
  const handleSubmit = (enrollmentData) => {
    if (editingEnrollment) {
      handleUpdateEnrollment(enrollmentData);
    } else {
      handleCreateEnrollment(enrollmentData);
    }
  };

  // Formatear fecha para mostrar en formato dd/MM/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  return (
    <div>
      <h1>Gestión de Matrículas</h1>

      {/* Filtros avanzados */}
      <EnrollmentFilters onFilter={handleFilter} />

      <button onClick={() => handleOpenModal()} className="add-button"><i className="fas fa-plus"></i> Añadir Matrícula</button>

      {feedbackMessage && <p className={`feedback-message ${feedbackMessage.includes('Error') ? 'error' : 'success'}`}>{feedbackMessage}</p>}
      {loading && <p>Cargando...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <table className="responsive-table">
          <thead>
            <tr>
              <th>ID Aula</th>
              <th>ID Estudiante</th>
              <th>Fecha Matrícula</th>
              <th>Año</th>
              <th>Periodo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td data-label="ID Aula">{enrollment.classroomId}</td>
                  <td data-label="ID Estudiante">{enrollment.studentId}</td>
                  <td data-label="Fecha Matrícula">{formatDate(enrollment.enrollmentDate)}</td>
                  <td data-label="Año">{enrollment.enrollmentYear || '-'}</td>
                  <td data-label="Periodo">{enrollment.enrollmentPeriod || '-'}</td>
                  <td data-label="Estado">{enrollment.status === 'A' ? 'Activo' : 'Inactivo'}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleOpenModal(enrollment)} className="edit"><i className="fas fa-edit"></i> Editar</button>
                    <button onClick={() => handleDeleteEnrollment(enrollment.id)} className="delete"><i className="fas fa-trash"></i> Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay matrículas para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal para Crear/Editar Matrícula */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEnrollment ? "Editar Matrícula" : "Crear Nueva Matrícula"}>
        <EnrollmentForm 
          initialData={editingEnrollment}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default EnrollmentPage;
