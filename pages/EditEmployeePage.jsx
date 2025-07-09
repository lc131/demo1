// src/pages/EditEmployeePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import  AuthContext  from '../context/AuthContext';

export default function EditEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useContext(AuthContext);
    const [emp, setEmp]     = useState(null);
    const [form, setForm]   = useState({});
    const [projUpdates, setProjUpdates] = useState({ addProjects: [], removeProjects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch single employee
        axios.get(`http://localhost:8080/api/v1/employees/${id}`)
            .then(res => {
                setEmp(res.data);
                setForm({
                    firstName: res.data.firstName,
                    lastName:  res.data.lastName,
                    emailId:   res.data.emailId,
                    departmentName: res.data.departmentName,
                    address: res.data.address || {street:'',city:'',country:''}
                });
            })
            .catch(() => alert('Failed to load'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading || !emp) return <p>Loading…</p>;
    if (role !== 'ADMIN') return <p>Unauthorized</p>;

    // Handle form change
    const onChange = (field, value) =>
        setForm(f => ({ ...f, [field]: value }));

    // Handle saving main info
    const saveInfo = async () => {
        await axios.put(
            `http://localhost:8080/api/v1/employees/${id}`,
            form
        );
        alert('Info updated');
    };

    // Handle project checkbox toggle
    const toggleProject = (projName, done) => {
        setProjUpdates(u => {
            let adds   = new Set(u.addProjects);
            let removes= new Set(u.removeProjects);
            if (done) {
                adds.add(projName);
                removes.delete(projName);
            } else {
                removes.add(projName);
                adds.delete(projName);
            }
            return {
                addProjects: Array.from(adds),
                removeProjects: Array.from(removes)
            };
        });
    };

    // Submit project updates
    const saveProjects = async () => {
        const payload = { updates: [{ id: Number(id), ...projUpdates }] };
        await axios.put(
            'http://localhost:8080/api/v1/employees/projects',
            payload
        );
        alert('Projects updated');
    };

    return (
        <div className="container">
            <header className="header">
                <h2>Edit Employee #{id}</h2>
                <Link to="/" className="btn">Back to List</Link>
            </header>

            <section className="main">
                {/* --- Basic Info Form --- */}
                <div className="form-section">
                    <h3>Basic Information</h3>
                    <label>First Name</label>
                    <input
                        value={form.firstName}
                        onChange={e => onChange('firstName', e.target.value)}
                    />

                    <label>Last Name</label>
                    <input
                        value={form.lastName}
                        onChange={e => onChange('lastName', e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        value={form.emailId}
                        onChange={e => onChange('emailId', e.target.value)}
                    />

                    <label>Department</label>
                    <input
                        value={form.departmentName}
                        onChange={e => onChange('departmentName', e.target.value)}
                    />

                    <label>Street</label>
                    <input
                        value={form.address.street}
                        onChange={e => setForm(f => ({
                            ...f,
                            address: { ...f.address, street: e.target.value }
                        }))}
                    />

                    <label>City</label>
                    <input
                        value={form.address.city}
                        onChange={e => setForm(f => ({
                            ...f,
                            address: { ...f.address, city: e.target.value }
                        }))}
                    />

                    <label>Country</label>
                    <input
                        value={form.address.country}
                        onChange={e => setForm(f => ({
                            ...f,
                            address: { ...f.address, country: e.target.value }
                        }))}
                    />

                    <button className="btn" onClick={saveInfo}>
                        Save Info
                    </button>
                </div>

                {/* --- Project Progress Section --- */}
                <div className="form-section">
                    <h3>Project Progress</h3>
                    {emp.projectName.map(name => {
                        // For demo, random progress percent:
                        const percent = Math.floor(Math.random() * 80) + 10;
                        const isDone = percent >= 100 || projUpdates.addProjects.includes(name);

                        return (
                            <div key={name} style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span>{name}</span>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isDone}
                                            onChange={e => toggleProject(name, e.target.checked)}
                                        /> Done
                                    </label>
                                </div>
                                <div style={{
                                    background: 'var(--light-gray-2)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    height: '8px',
                                    marginTop: '4px'
                                }}>
                                    <div style={{
                                        width: `${Math.min(100, percent)}%`,
                                        height: '100%',
                                        background: 'var(--selective-blue)'
                                    }} />
                                </div>
                            </div>
                        );
                    })}

                    <button className="btn" onClick={saveProjects}>
                        Save Projects
                    </button>
                </div>
            </section>
        </div>
    );
}
