import apiClient from './api';

// Obtener todas las matrículas
export const getAllEnrollments = () => {
  return apiClient.get('/classroom-students');
};

// Crear matrícula
export const createEnrollment = (enrollmentData) => {
  return apiClient.post('/classroom-students', enrollmentData);
};

// Obtener matrícula por ID
export const getEnrollmentById = (id) => {
  return apiClient.get(`/classroom-students/${id}`);
};

// Actualizar matrícula
export const updateEnrollment = (id, enrollmentData) => {
  return apiClient.put(`/classroom-students/${id}`, enrollmentData);
};

// Eliminar matrícula
export const deleteEnrollment = (id) => {
  return apiClient.delete(`/classroom-students/${id}`);
};

// Listar matrículas por estudiante
export const getEnrollmentsByStudent = (studentId) => {
  return apiClient.get(`/classroom-students/student/${studentId}`);
};

// Listar matrículas por aula
export const getEnrollmentsByClassroom = (classroomId) => {
  return apiClient.get(`/classroom-students/classroom/${classroomId}`);
};

// Listar matrículas por estado
export const getEnrollmentsByStatus = (status) => {
  return apiClient.get(`/classroom-students/status/${status}`);
};

// Listar matrículas por año
export const getEnrollmentsByYear = (enrollmentYear) => {
  return apiClient.get(`/classroom-students/year/${enrollmentYear}`);
};

// Listar matrículas por periodo
export const getEnrollmentsByPeriod = (enrollmentPeriod) => {
  return apiClient.get(`/classroom-students/period/${enrollmentPeriod}`);
};

// Listar matrículas por estudiante y estado
export const getEnrollmentsByStudentAndStatus = (studentId, status) => {
  return apiClient.get(`/classroom-students/student/${studentId}/status/${status}`);
};

// Listar matrículas por aula y estado
export const getEnrollmentsByClassroomAndStatus = (classroomId, status) => {
  return apiClient.get(`/classroom-students/classroom/${classroomId}/status/${status}`);
};
