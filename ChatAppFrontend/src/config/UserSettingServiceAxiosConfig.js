import axios from "axios";
import { refreshToken } from "../services/UserSettingService/UserSettingService";
const apiGatewayServiceUrl = import.meta.env.VITE_API_GATEWAY_URL;
const userSettingService = axios.create({
	baseURL: apiGatewayServiceUrl,
	timeout: 1000 * 60 * 3,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Axios interceptors for handling tokens
userSettingService.interceptors.request.use(
	(config) => {
		const publicPaths = [
			"/user/save",
			"/auth/refresh-token",
			"/auth/sign-up",
			"/auth/login",
			"/auth/verify-otp/",
		];
		// Safer path checking
		const isPublicPath = publicPaths.some(
			(path) => config.url && config.url.includes(path)
		);

		if (!isPublicPath) {
			const token = sessionStorage.getItem("accessToken");
			if (token && token !== "undefined") {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Variables to manage token refresh
let isRefreshing = false;
let failedQueue = [];

// Function to process the queue after token refresh
const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		error ? prom.reject(error) : prom.resolve(token);
	});
	failedQueue = [];
};

// Handling responses
userSettingService.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle case where response might not exist
		if (!error.response) {
			return Promise.reject(error);
		}

		console.log("error status: " + error.response.status);

		// Check if it's a 401 error and not already retried
		if (error.response.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue the request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers[
							"Authorization"
						] = `Bearer ${token}`;
						return userSettingService(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			// Mark the original request as being retried
			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await refreshToken();

				// Check if we have a valid token in the response
				if (response && response.data && response.data.accessToken) {
					const newToken = response.data.accessToken;
					sessionStorage.setItem("accessToken", newToken);
					originalRequest.headers[
						"Authorization"
					] = `Bearer ${newToken}`;

					// Process any queued requests with just the token string
					processQueue(null, newToken);

					// Retry the original request
					return userSettingService(originalRequest);
				} else {
					// Handle case where refresh token request succeeded but no token returned
					const refreshError = new Error("No valid token returned");
					processQueue(refreshError);
					return Promise.reject(refreshError);
				}
			} catch (refreshError) {
				processQueue(refreshError);
				// Clear token if refresh failed (likely expired refresh token)
				sessionStorage.removeItem("accessToken");
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// For any other error, just reject
		return Promise.reject(error);
	}
);

export default userSettingService;
