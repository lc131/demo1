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

export const logout = async () => {
    try {
        // 1. Gọi API logout để server xóa token khỏi Redis
        await axios.post(`${API_URL}/logout`, null, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (err) {
        // nếu lỗi (ví dụ token đã hết hạn), vẫn tiếp tục xóa local
        console.warn('Logout request failed:', err);
    } finally {
        // 2. Xóa ở client
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
};
