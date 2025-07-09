import React from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi'; // or any icon lib
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function EmployeeCard({
                                         emp,
                                         showAddress,
                                         onDelete
                                     }) {
    const navigate = useNavigate();

    const goToEdit = () => {
        navigate(`/edit/${emp.id}`);
    };

    return (
        <div
            className="employee-card"
            style={{ cursor: 'pointer' }}
            onClick={goToEdit}
        >
            {/* Delete/Edit icons */}
            {onDelete && (
                <div
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: '0.5rem'
                    }}
                    // Prevent click on delete icon from triggering the card’s onClick
                    onClick={e => { e.stopPropagation(); }}
                >
                    <BiTrash
                        size={18}
                        style={{ cursor: 'pointer', color: 'var(--radical-red)' }}
                        onClick={() => onDelete(emp.id)}
                    />
                </div>
            )}

            {/* Card content */}
            <div className="employee-card__header">
                <div className="employee-card__name">
                    {emp.lastName} {emp.firstName} #{emp.id}
                </div>
                <div className="employee-card__dept">
                    {emp.departmentName}
                </div>
            </div>

            <div className="employee-card__body">
                <p><strong>Email:</strong> {emp.emailId}</p>
                {showAddress && emp.address && (
                    <p>
                        <strong>Address:</strong> {emp.address.street}, {emp.address.city}, {emp.address.country}
                    </p>
                )}
                <p>
                    <strong>Projects:</strong> {emp.projectName.join(', ')}
                </p>
            </div>
        </div>
    );
}
