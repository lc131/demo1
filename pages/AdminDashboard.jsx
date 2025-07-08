import React, { useEffect, useState } from 'react';
import axios from "axios";
import EmployeeTable from '../components/EmployeeTable.jsx';
// full info + progress
const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        axios.get('/api/v1/employees').then(res => setEmployees(res.data));
    }, []);

    return <EmployeeTable data={employees} showAddress />;
};

export default AdminDashboard;