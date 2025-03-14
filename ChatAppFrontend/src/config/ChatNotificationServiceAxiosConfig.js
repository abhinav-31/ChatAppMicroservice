import axios from 'axios';
const apiGatewayServiceUrl = import.meta.env.VITE_API_GATEWAY_URL;

const chatNotificationService = axios.create({
	baseURL: apiGatewayServiceUrl,
	timeout: 10000000,
	headers: {
		"Content-Type": "application/json",
	},
	// Ensures that cookies are sent with requests
});

// Axios interceptors for handling tokens (if needed in headers)
chatNotificationService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config; // Continue the request
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handling responses (optional)
chatNotificationService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default chatNotificationService;
