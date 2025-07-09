import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';
import Dashboard from "./pages/Dashboard";
import EditEmployeePage from "./pages/EditEmployeePage.jsx";

export default function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={
                    <ProtectedRoute roles={['ADMIN', 'EMPLOYEE']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
                       ></Route>
                {/*<Route*/}
                {/*    path="/"*/}
                {/*    element={*/}
                {/*        <ProtectedRoute roles={['ADMIN', 'EMPLOYEE']}>*/}
                {/*            {role === 'ADMIN' ? <AdminDashboard /> : <EmployeeDashboard />}*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                <Route path="/edit/:id" element={<EditEmployeePage />} />
            </Routes>
        </BrowserRouter>
    );
}
