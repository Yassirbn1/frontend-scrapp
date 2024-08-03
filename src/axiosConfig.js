import axios from 'axios';

export const configureAxios = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized, redirecting to login...");
            // Redirection logic here, e.g., window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;
