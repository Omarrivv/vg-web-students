import axios from 'axios';

const API_CONFIG = {
    BASE_URL: 'http://localhost:8081/api/v1',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || 'Error en la petición';
        console.error('Error API:', message);
        return Promise.reject(error);
    }
);

export { API_CONFIG, apiClient }; 