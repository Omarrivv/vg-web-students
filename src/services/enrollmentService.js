import { apiClient } from '../config/api.config';

export const enrollmentService = {
    // Obtener todas las matrículas
    getAllEnrollments: async () => {
        try {
            const response = await apiClient.get('/classroom-students');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener matrícula por ID
    getEnrollmentById: async (id) => {
        try {
            const response = await apiClient.get(`/classroom-students/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Crear matrícula
    createEnrollment: async (enrollmentData) => {
        try {
            const response = await apiClient.post('/classroom-students', enrollmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar matrícula
    updateEnrollment: async (id, enrollmentData) => {
        try {
            const response = await apiClient.put(`/classroom-students/${id}`, enrollmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar matrícula
    deleteEnrollment: async (id) => {
        try {
            const response = await apiClient.delete(`/classroom-students/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Restaurar matrícula
    restoreEnrollment: async (id) => {
        try {
            const response = await apiClient.put(`/classroom-students/${id}/restore`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por estudiante
    getEnrollmentsByStudent: async (studentId) => {
        try {
            const response = await apiClient.get(`/classroom-students/student/${studentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por aula
    getEnrollmentsByClassroom: async (classroomId) => {
        try {
            const response = await apiClient.get(`/classroom-students/classroom/${classroomId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por estado
    getEnrollmentsByStatus: async (status) => {
        try {
            const response = await apiClient.get(`/classroom-students/status/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por año
    getEnrollmentsByYear: async (year) => {
        try {
            const response = await apiClient.get(`/classroom-students/year/${year}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por periodo
    getEnrollmentsByPeriod: async (period) => {
        try {
            const response = await apiClient.get(`/classroom-students/period/${period}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por estudiante y estado
    getEnrollmentsByStudentAndStatus: async (studentId, status) => {
        try {
            const response = await apiClient.get(`/classroom-students/student/${studentId}/status/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Listar matrículas por aula y estado
    getEnrollmentsByClassroomAndStatus: async (classroomId, status) => {
        try {
            const response = await apiClient.get(`/classroom-students/classroom/${classroomId}/status/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
