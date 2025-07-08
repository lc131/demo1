import React from 'react';
import '../App.css';
const EmployeeTable = ({ data, showAddress }) => {
if (!Array.isArray(data)) {
    return <p>Error: data is not an array</p>; // Hoặc return null;
}

return (
    <table className="employee-table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Project</th>
            {showAddress && (<th>Address</th>)}
        </tr>
        </thead>
        <tbody>
        {data.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.emailId}</td>
                <td>{employee.departmentName}</td>
                <td>{/* Join array elements with a comma and space */}
                    {employee.projectName && employee.projectName.length > 0
                        ? employee.projectName.join(', ')
                        : 'N/A'} {/* Handle cases where projects might be empty or null */}
                </td>
                {showAddress && (
                    <td>
                        {employee.address
                            ? `${employee.address.street}, ${employee.address.city}, ${employee.address.country}`
                            : '***'}
                    </td>
                    )}
            </tr>
        ))}
        </tbody>
    </table>
);
};

export default EmployeeTable;