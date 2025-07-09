// src/pages/EditEmployeePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext  from '../context/AuthContext';
import {updateProjects} from "../api/employee.js";
import '../App.css';
import '../index.css';

export default function EditEmployeePage() {
    const { id } = useParams();
    const { role } = useContext(AuthContext);
    const [emp, setEmp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dirty, setDirty] = useState(false);

    // Form state for basic info
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        departmentName: '',
        address: { street: '', city: '', country: '' }
    });

    // Projects state: { name, progress, isNew, toRemove }
    const [projects, setProjects] = useState([]);
    const [newProjName, setNewProjName] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(`emp-prog-${id}`)) || {};
        axios.get(`/api/v1/employees/${id}`)
            .then(res => {
                const data = res.data;
                setEmp(data);
                setForm({
                    firstName: data.firstName,
                    lastName:  data.lastName,
                    emailId:   data.emailId,
                    departmentName: data.departmentName,
                    address: data.address || { street: '', city: '', country: '' }
                });
                const init = data.projectName.map(name => ({
                    name,
                    progress: stored[name] || 0,
                    isNew: false,
                    toRemove: false
                }));
                setProjects(init);
            })
            .catch(() => setError('Failed to load employee'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading…</p>;
    if (error)   return <p style={{ color: 'red' }}>{error}</p>;
    if (role !== 'ADMIN') return <p>Unauthorized</p>;

    // Persist progress map
    const saveProgressLocally = list => {
        const map = list.reduce((acc, p) => ({ ...acc, [p.name]: p.progress }), {});
        localStorage.setItem(`emp-prog-${id}`, JSON.stringify(map));
    };

    const onProgressChange = (idx, value) => {
        setProjects(ps => {
            const next = [...ps];
            next[idx].progress = Number(value);
            setDirty(true);
            saveProgressLocally(next);
            return next;
        });
    };

    const toggleRemove = idx => {
        setProjects(ps => {
            const next = ps.map((p,i) =>
                i===idx ? { ...p, toRemove: !p.toRemove } : p
            );
            setDirty(true);
            return next;
        });
    };


    const addProject = () => {
        const name = newProjName.trim();
        if (!name) return;
        setProjects(ps => {
            const next = [...ps, { name, progress: 0, isNew: true, toRemove: false }];
            saveProgressLocally(next);
            return next;
        });
        setNewProjName('');
    };

    const saveInfo = async () => {
        try {
            await axios.put(`/api/v1/employees/${id}`, form);
            alert('Employee info updated');
        } catch {
            alert('Failed to update info');
        }
    };

    const saveProjects = async () => {
        // Prepare add/remove lists
        const addProjects = projects
            .filter(p => p.isNew && !p.toRemove)
            .map(p => p.name);
        const removeProjects = projects
            .filter(p => p.toRemove && !p.isNew)
            .map(p => p.name);

        const payload = {
            updates: [
                { id: Number(id), addProjects, removeProjects }
            ]
        };

        try {
            await updateProjects(payload);
            // Update local UI: remove projects marked for removal
            setProjects(ps => ps.filter(p => !(p.toRemove && !p.isNew)));
            alert('Projects updated');
        } catch {
            alert('Failed to update projects');
        }
    };

return (
    <div className="container">
        <header className="header">
            <h2>Edit Employee #{id}</h2>
            <Link to="/" className="btn">← Back to List</Link>
        </header>

        <section className="main">
            {/* Basic info form */}
            <div className="edit-section">
                <h3>Basic Information</h3>
                {['firstName','lastName','emailId','departmentName'].map(field => (
                    <div key={field} className="input-box">
                        <label className="details">{field}</label>
                        <input
                            value={form[field]}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        />
                    </div>
                ))}
                {['street','city','country'].map(loc => (
                    <div key={loc} className="input-box">
                        <label className="details">Address {loc}</label>
                        <input
                            value={form.address[loc]}
                            onChange={e => setForm(f => ({
                                ...f,
                                address: { ...f.address, [loc]: e.target.value }
                            }))}
                        />
                    </div>
                ))}
                <button className="btn" onClick={saveInfo}>Save Info</button>
            </div>

            {/* Projects */}
            <div className="edit-section" style={{ marginTop: '2rem' }}>
                <h3>Projects</h3>
                {projects.map((p, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', position: 'relative' }}>
                        <button
                            className={`proj-btn ${p.toRemove ? 'undo' : 'remove'}`}
                            onClick={() => toggleRemove(idx)}
                        >
                            {p.toRemove ? 'Undo' : 'Remove'}
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ textDecoration: p.toRemove ? 'line-through' : 'none' }}>
                  {p.name}
                </span>
                            <span>{p.progress}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={p.progress}
                            disabled={p.toRemove}
                            onChange={e => onProgressChange(idx, e.target.value)}
                        />
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
                    <input
                        type="text"
                        placeholder="New project name"
                        value={newProjName}
                        onChange={e => setNewProjName(e.target.value)}
                    />
                    <button className="btn" onClick={addProject}>Add Project</button>
                </div>
                <button
                    className="btn"
                    onClick={saveProjects}
                    disabled={!dirty}
                >
                    Save Project Changes
                </button>
            </div>
        </section>
    </div>
);
}
