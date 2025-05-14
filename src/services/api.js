import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // Tu URL base del backend
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
