import axios from "axios";

// Create axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to attach the access token to requests
api.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If error is not 401 or request has already been retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }
        
        // If already refreshing, add to queue
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            .then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return api(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }
            
            const refreshUrl = import.meta.env.VITE_REFRESH_TOKEN || "/api/v1/auth/refresh-token";
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}${refreshUrl}`, 
                { refreshToken }
            );
            
            if (response.data && response.data.success) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                sessionStorage.setItem("accessToken", accessToken);
                
                if (newRefreshToken) {
                    sessionStorage.setItem("refreshToken", newRefreshToken);
                }
                
                // Update authorization header and retry original request
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                
                // Process queue with new token
                processQueue(null, accessToken);
                
                return api(originalRequest);
            } else {
                // If refresh failed, clear auth and redirect to login
                sessionStorage.clear();
                window.location.href = "/login";
                
                // Process queue with error
                processQueue(new Error("Failed to refresh token"));
                return Promise.reject(error);
            }
        } catch (refreshError) {
            // If refresh failed, clear auth and redirect to login
            sessionStorage.clear();
            window.location.href = "/login";
            
            // Process queue with error
            processQueue(refreshError);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

