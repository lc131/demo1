import React from 'react';
import '../App.css';
const EmployeeTable = ({ data, showAddress, onEdit, onDelete}) => {
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
                {onEdit && <th>Edit</th>}
                {onDelete && <th>Del</th>}
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
                    {onEdit && <td><button onClick={()=>onEdit(employee)}>✎</button></td>}
                    {onDelete && <td><button onClick={()=>onDelete(employee.id)}>🗑</button></td>}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

//     return (
//         <div className="contact__item">
//             <div className="contact__header">
//                 {/* Employee Avatar */}
//                 <div className="contact__image">
//                     <img
//                         src={data.imageUrl || 'https://placehold.co/50x50/cccccc/ffffff?text=No+Img'}
//                         alt={`${data.firstName} ${data.lastName}`}
//                         onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50/cccccc/ffffff?text=No+Img" }}
//                     />
//                 </div>
//                 {/* Employee Name and Position */}
//                 <div className="contact__info">
//                     <h3 className="contact_name">{data.firstName} {data.lastName}</h3>
//                     <p className="contact_title">{data.departmentName || 'Chưa xác định'}</p>
//                 </div>
//                 {/* Edit Button (Top Right) */}
//                 <button
//                     className="btn btn-edit-card"
//                     onClick={() => onEdit(data.id)}
//                     title="Sửa thông tin nhân viên"
//                 >
//                     <i className="fas fa-edit"></i>
//                 </button>
//             </div>
//
//             <div className="contact__body">
//                 {/* Email */}
//                 <p>
//                     <i className="fas fa-envelope"></i> {data.emailId}
//                 </p>
//                 {/* Address (City, Country) */}
//
//                 {showAddress && (data.address && (
//                     <p>
//                         <i className="fas fa-map-marker-alt"></i>
//                         {data.address.city && `${data.address.city}`}
//                         {data.address.city && data.address.country && `, `}
//                         {data.address.country && `${data.address.country}`}
//                     </p>
//                     )
//                 )}
//                 {/*/!* Phone Number *!/*/}
//                 {/*{employee.phoneNumber && (*/}
//                 {/*    <p>*/}
//                 {/*        <i className="fas fa-phone"></i> {employee.phoneNumber}*/}
//                 {/*    </p>*/}
//                 {/*)}*/}
//                 {/* Status (Active/Inactive) */}
//                 {/*<p className={`employee-status ${isActive ? 'active' : 'inactive'}`}>*/}
//                 {/*    <i className={`fas ${isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i>*/}
//                 {/*    {isActive ? 'Active' : 'Inactive'}*/}
//                 {/*</p>*/}
//             </div>
//             {/* Delete Button (Bottom Right) */}
//             <div className="contact__footer">
//                 <button
//                     className="btn btn-danger btn-delete-card"
//                     onClick={() => onDelete(data.id)}
//                     title="Xóa nhân viên"
//                 >
//                     <i className="fas fa-trash-alt"></i>
//                 </button>
//             </div>
//         </div>
//     );
// };

export default EmployeeTable;