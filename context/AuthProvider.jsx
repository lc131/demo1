// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import axios from "axios";
import {useNavigate} from "react-router";

// const AuthProvider = ({ children }) => {
//     const [role, setRole] = useState(null);
//
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             setRole(payload.role);
//         }
//     }, []);
//
//     const login = async (username, password) => {
//         await apiLogin(username, password);
//         const token = localStorage.getItem('token');
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setRole(payload.role);
//     };
//
//     const logout = () => {
//         apiLogout();
//         setRole(null);
//     };
//
//     return (
//         <AuthContext.Provider value={{ role, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    // const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setRole(payload.role);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = async (username, password) => {
        const res = await axios.post('http://localhost:8080/api/auth/login', { username, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setRole(null);
        //navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
