import { apiClient } from '../config/api.config';

export const studentService = {
// Obtener todos los estudiantes
    getAllStudents: async () => {
        try {
            const response = await apiClient.get('/students');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Obtener estudiante por ID
    getStudentById: async (id) => {
        try {
            const response = await apiClient.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Crear estudiante
    createStudent: async (studentData) => {
        try {
            const response = await apiClient.post('/students', studentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Actualizar estudiante
    updateStudent: async (id, studentData) => {
        try {
            const response = await apiClient.put(`/students/${id}`, studentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar estudiante (borrado lógico)
    deleteStudent: async (id) => {
        try {
            const response = await apiClient.delete(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Restaurar estudiante
    restoreStudent: async (id) => {
        try {
            const response = await apiClient.put(`/students/${id}/restore`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Listar estudiantes por institución
    getStudentsByInstitution: async (institutionId) => {
        try {
            const response = await apiClient.get(`/students/institution/${institutionId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Listar estudiantes por estado
    getStudentsByStatus: async (status) => {
        try {
            const response = await apiClient.get(`/students/status/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

// Listar estudiantes por género
    getStudentsByGender: async (gender) => {
        try {
            const response = await apiClient.get(`/students/gender/${gender}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
