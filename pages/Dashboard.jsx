import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import EmployeeCard from '../components/EmployeeCard';
import Pagination from '../components/Pagination';
import EmployeeForm from '../components/EmployeeForm';
import { fetchAll, deleteOne } from '../api/employee';
import { BiAddToQueue } from "react-icons/bi";
import '../App.css';
import '../index.css';

export default function Dashboard() {
    const { role, logout } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const totalPages = Math.ceil(data.length / pageSize);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAll();
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load employees');
            }
        };
        load();
    }, []);

    const refresh = () => {
        setShowForm(false);
        setEditEmployee(null);
        setPage(1);
        fetchAll().then(r => setData(r.data));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;
        await deleteOne(id);
        refresh();
    };

    // Compute visible slice
    const start = (page - 1) * pageSize;
    const visible = data.slice(start, start + pageSize);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="container">
            <header className="header">
                {role === 'ADMIN' && (

                    <button className="btn" onClick={() => setShowForm(true)}>
                        <BiAddToQueue /> Add New
                    </button>
                )}
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="main">
                <div className="employee-grid">
                    {visible.map(emp => (
                        <EmployeeCard
                            key={emp.id}
                            emp={emp}
                            showAddress={role === 'ADMIN'}
                            onEdit={role === 'ADMIN' ? () => { setEditEmployee(emp); setShowForm(true); } : null}
                            onDelete={role === 'ADMIN' ? () => handleDelete(emp.id) : null}
                        />
                    ))}
                </div>

                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </main>

            {showForm && (
                <EmployeeForm
                    initial={editEmployee}
                    onSaved={refresh}
                    onCancel={() => { setShowForm(false); setEditEmployee(null); }}
                />
            )}
        </div>
    );
}
