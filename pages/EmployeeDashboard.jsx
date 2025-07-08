// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import EmployeeTable from '../components/EmployeeTable.jsx';
//
// const EmployeeDashboard = () => {
//     const [employees, setEmployees] = useState([]);
//     useEffect(() => {
//         axios.get('/api/v1/employees').then(res => setEmployees(res.data));
//     }, []);
//
//     return <EmployeeTable data={employees} showAddress={false} />;
// };
//
// export default EmployeeDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeTable from '../components/EmployeeTable';

const EmployeeDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/v1/employees', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setEmployees(res.data);
                } else {
                    setError("Response is not an array");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch employees");
            });
    }, []);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return <EmployeeTable data={employees} showAddress={false} />;
};

export default EmployeeDashboard;
