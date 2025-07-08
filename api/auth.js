import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = async (username, password) => {
    return axios.post(`${API_URL}/register`, { username, password});
};

export const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

