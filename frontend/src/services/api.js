import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Enable sending cookies
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Making request to:', config.url, 'with data:', config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    // Registration flow
    sendRegistrationOtp: (data) => api.post('/auth/send-registration-otp', data),
    verifyRegistrationOtp: (data) => api.post('/auth/verify-registration-otp', data),

    // Login
    login: (credentials) => api.post('/auth/login', credentials),

    // OTP management
    resendOtp: (email) => api.post('/auth/resend-otp', { email }),

    // Token verification
    verifyToken: () => api.get('/auth/verify-token'),

    // Logout
    logout: () => {
        localStorage.removeItem('token');
    },
};

// User services
export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

export const apiService = {
    // Products
    getProducts: () => api.get('/products/products'),
    getProduct: (id) => api.get(`/products/products/${id}`),
    createProduct: (data) => api.post('/products/products', data),
    updateProduct: (id, data) => api.put(`/products/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/products/${id}`),

    // Groceries
    getGroceries: () => api.get('/products/groceries'),
    getGrocery: (id) => api.get(`/products/groceries/${id}`),
    createGrocery: (data) => api.post('/products/groceries', data),
    updateGrocery: (id, data) => api.put(`/products/groceries/${id}`, data),
    deleteGrocery: (id) => api.delete(`/products/groceries/${id}`),

    // Services
    getService: (id) => api.get(`/services/${id}`),

    // Users
    getUsers: () => api.get('/users'),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),

    // Orders
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    // Dashboard
    getDashboardData: async () => {
        try {
            const response = await api.get('/orders/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },

    // Add updateOrderStatus function
    updateOrderStatus: async (orderId, status) => {
        try {
            console.log('Sending update request for order:', orderId, 'status:', status);
            const response = await api.put(`/orders/${orderId}/status`, { status });
            console.log('Update response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                    config: {
                        url: error.config.url,
                        method: error.config.method,
                        headers: error.config.headers
                    }
                });
            }
            throw error;
        }
    },

    // Add verifyToken function
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify-token');
            return response;
        } catch (error) {
            console.error('Token verification failed:', error);
            throw error;
        }
    },

    // Example of adding a new function
    // register: (userData) => api.post('/auth/register', userData),
    // login: (credentials) => api.post('/auth/login', credentials),
    // createOrder: (orderData) => api.post('/api/orders', orderData),
};

export default api; 