// src/pages/EditEmployeePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { updateProjects } from "../api/employee.js";
import '../App.css'; // <--- Ensure this is imported
import { BiArrowBack } from 'react-icons/bi';

export default function EditEmployeePage() {
    const { id } = useParams();
    const { role } = useContext(AuthContext);
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
    const [projectSaveStatus, setProjectSaveStatus] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(`emp-prog-${id}`)) || {};
        axios.get(`/api/v1/employees/${id}`)
            .then(res => {
                const data = res.data;
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    emailId: data.emailId || '',
                    departmentName: data.departmentName || '',
                    address: data.address || { street: '', city: '', country: '' }
                });
                const initProjects = (data.projectName || []).map(name => ({
                    name,
                    progress: stored[name] || 0,
                    isNew: false,
                    toRemove: false
                }));
                setProjects(initProjects);
            })
            .catch(err => {
                console.error("Error loading employee:", err);
                setError('Failed to load employee data. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const validateBasicInfo = () => {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.emailId.trim() || !form.departmentName.trim() ||
            !form.address.street.trim() || !form.address.city.trim() || !form.address.country.trim()) {
            alert('Please fill in all basic information fields.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(form.emailId)) {
            alert('Please enter a valid email address.');
            return false;
        }
        return true;
    };

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
            const next = ps.map((p, i) =>
                i === idx ? { ...p, toRemove: !p.toRemove } : p
            );
            setDirty(true);
            return next;
        });
    };

    const addProject = () => {
        const name = newProjName.trim();
        if (!name) {
            alert('Project name cannot be empty!');
            return;
        }
        // Check for duplicate project names (case-insensitive) among currently active projects
        if (projects.some(p => p.name.toLowerCase() === name.toLowerCase() && !p.toRemove)) {
            alert('A project with this name already exists or is about to be added!');
            return;
        }

        setProjects(ps => {
            const next = [...ps, { name, progress: 0, isNew: true, toRemove: false }];
            setDirty(true);
            saveProgressLocally(next);
            return next;
        });
        setNewProjName('');
    };

    const saveInfo = async () => {
        if (!validateBasicInfo()) {
            return;
        }
        try {
            await axios.put(`/api/v1/employees/${id}`, form);
            alert('Employee info updated successfully!');
        } catch (err) {
            console.error("Failed to update info:", err);
            alert('Failed to update employee info. Please try again.');
        }
    };

    const saveProjects = async () => {
        setProjectSaveStatus('Saving projects...');
        const addProjects = projects
            .filter(p => p.isNew && !p.toRemove)
            .map(p => p.name);
        const removeProjects = projects
            .filter(p => p.toRemove && !p.isNew)
            .map(p => p.name);

        // Only send if there are actual changes to be made
        if (addProjects.length === 0 && removeProjects.length === 0) {
            setProjectSaveStatus('No project changes to save.');
            setTimeout(() => setProjectSaveStatus(''), 2000);
            return;
        }

        const payload = {
            updates: [
                { id: Number(id), addProjects, removeProjects }
            ]
        };

        try {
            await updateProjects(payload);
            setProjects(ps => ps.filter(p => !(p.toRemove && !p.isNew))
                .map(p => ({ ...p, isNew: false }))); // Reset isNew flag for saved projects
            setDirty(false);
            setProjectSaveStatus('Projects updated successfully!');
        } catch (err) {
            console.error("Failed to update projects:", err);
            setProjectSaveStatus('Failed to update projects. Please try again.');
        } finally {
            setTimeout(() => setProjectSaveStatus(''), 3000);
        }
    };

    if (loading) return <p className="loading-message">Loading employee data...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (role !== 'ADMIN') return <p className="error-message">Access Denied: You must be an ADMIN to view this page.</p>;

    return (
        <div className="edit-employee-page-container">
            <header className="edit-employee-page-header">
                <h2>Edit Employee #{id}</h2>
                <Link to="/" className="btn-back">
                    <BiArrowBack /> Back
                </Link>
            </header>

            <section className="main-content-columns">
                <div className="edit-section basic-info-section">
                    <h3>Basic Information</h3>
                    <div className="basic-info-form-grid">
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                value={form.firstName}
                                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="emailId">Email ID</label>
                            <input
                                id="emailId"
                                type="email"
                                value={form.emailId}
                                onChange={e => setForm(f => ({ ...f, emailId: e.target.value }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="departmentName">Department Name</label>
                            <input
                                id="departmentName"
                                type="text"
                                value={form.departmentName}
                                onChange={e => setForm(f => ({ ...f, departmentName: e.target.value }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="street">Address Street</label>
                            <input
                                id="street"
                                type="text"
                                value={form.address.street}
                                onChange={e => setForm(f => ({
                                    ...f,
                                    address: { ...f.address, street: e.target.value }
                                }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="city">Address City</label>
                            <input
                                id="city"
                                type="text"
                                value={form.address.city}
                                onChange={e => setForm(f => ({
                                    ...f,
                                    address: { ...f.address, city: e.target.value }
                                }))}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="country">Address Country</label>
                            <input
                                id="country"
                                type="text"
                                value={form.address.country}
                                onChange={e => setForm(f => ({
                                    ...f,
                                    address: { ...f.address, country: e.target.value }
                                }))}
                            />
                        </div>
                    </div>
                    <div className="save-info-btn-wrapper">
                        <button className="save-info-btn" onClick={saveInfo}>Save Info</button>
                    </div>
                </div>

                <div className="edit-section projects-section">
                    <h3>Projects</h3>
                    <div className="projects-list">
                        {projects.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No projects assigned yet.</p>}
                        {projects.map((p, idx) => (
                            <div key={`${p.name}-${idx}`} className="project-item"> {/* Improved key for reliability */}
                                <div className="project-info">
                                    <div className="project-name-progress">
                                        <span className={`name ${p.toRemove ? 'to-remove' : ''}`}> {/* Apply .to-remove class */}
                                            {p.name} {p.isNew && <span className="new-tag">(New)</span>} {/* Apply .new-tag class */}
                                        </span>
                                        <span className="progress">{p.progress}%</span>
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
                                <button
                                    className={`proj-btn ${p.toRemove ? 'undo' : 'remove'}`}
                                    onClick={() => toggleRemove(idx)}
                                >
                                    {p.toRemove ? 'Undo' : 'Remove'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="add-project-input-group">
                        <input
                            type="text"
                            placeholder="New project name"
                            value={newProjName}
                            onChange={e => setNewProjName(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addProject();
                                }
                            }}
                        />
                        <button className="btn-add-project" onClick={addProject}>
                            Add Project
                        </button>
                    </div>

                    {projectSaveStatus && <p style={{ textAlign: 'center', margin: '15px 0', color: projectSaveStatus.includes('success') ? 'green' : 'red' }}>{projectSaveStatus}</p>}

                    <div className="save-project-changes-btn-wrapper">
                        <button
                            className="save-project-changes-btn"
                            onClick={saveProjects}
                            disabled={!dirty}
                        >
                            Save Project Changes
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}