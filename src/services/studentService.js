import apiClient from './api';

// Obtener todos los estudiantes
export const getAllStudents = () => apiClient.get('/students');

// Obtener estudiante por ID
export const getStudentById = (id) => apiClient.get(`/students/${id}`);

// Crear estudiante
export const createStudent = (studentData) => apiClient.post('/students', studentData);

// Actualizar estudiante
export const updateStudent = (id, studentData) => apiClient.put(`/students/${id}`, studentData);

// Eliminar estudiante
export const deleteStudent = (id) => apiClient.delete(`/students/${id}`);

// Listar estudiantes por institución
export const getStudentsByInstitution = (institutionId) => apiClient.get(`/students/institution/${institutionId}`);

// Listar estudiantes por estado
export const getStudentsByStatus = (status) => apiClient.get(`/students/status/${status}`);

// Listar estudiantes por género
export const getStudentsByGender = (gender) => apiClient.get(`/students/gender/${gender}`);
