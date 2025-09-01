// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://ejet.onrender.com'
  : 'http://localhost:5001';

export { API_BASE_URL };
