import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
// HOC for auth protection
const ProtectedRoute = ({ children, roles }) => {
    const { role } = useContext(AuthContext);
    if (!role) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
    return children;
};

export default ProtectedRoute;