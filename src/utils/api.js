import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth-storage');
        const token = authData ? JSON.parse(authData)?.state?.token : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn(`No token found for request to: ${config.url}`);
        }

        // Add metadata for timing
        config.metadata = { startTime: new Date() };

        // Setup slow request warning (for cold starts)
        config.slowRequestTimeout = setTimeout(() => {
            // Only show for GET requests or critical paths
            import('react-hot-toast').then(({ toast }) => {
                toast.loading('Connecting to server... (this may take a moment if server is waking up)', {
                    id: 'slow-request-' + config.url,
                    duration: 5000,
                });
            });
        }, 3000); // Warn after 3 seconds

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Clear timeout
        if (response.config.slowRequestTimeout) {
            clearTimeout(response.config.slowRequestTimeout);
            // Dismiss warning toast if it appeared
            import('react-hot-toast').then(({ toast }) => {
                toast.dismiss('slow-request-' + response.config.url);
            });
        }
        return response;
    },
    (error) => {
        // Clear timeout on error too
        if (error.config?.slowRequestTimeout) {
            clearTimeout(error.config.slowRequestTimeout);
            import('react-hot-toast').then(({ toast }) => {
                toast.dismiss('slow-request-' + error.config.url);
            });
        }

        if (error.response?.status === 401) {
            // Optional: Logout user on 401
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
