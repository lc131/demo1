import React, { useState, useEffect } from 'react';
import { createOne, updateOne } from '../api/employee';
import '../App.css';
import '../index.css';


export default function EmployeeForm({ initial, onSaved, onCancel }) {
    const isEdit = Boolean(initial && initial.id);
    const [e, setE] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        departmentName: '',
        address: { street: '', city: '', country: '' },
        projectName: [] // projectName will store an array of strings
    });
    // State to hold validation errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            setE({
                firstName: initial.firstName || '',
                lastName: initial.lastName || '',
                emailId: initial.emailId || '',
                departmentName: initial.departmentName || '',
                address: initial.address || { street: '', city: '', country: '' },
                // Ensure projectName is an array, even if API sends null/undefined
                projectName: Array.isArray(initial.projectName) ? initial.projectName : []
            });
        }
    }, [initial, isEdit]);

    // **IMPORTANT:** Handle the projects input value correctly
    // The input's `value` will be a comma-separated string, but `e.projectName` is an array.
    // We need a temporary state or derive the input value from the array.
    const [projectsInput, setProjectsInput] = useState('');

    useEffect(() => {
        // When initial data loads or changes, update the projects input string
        if (isEdit && Array.isArray(initial.projectName)) {
            setProjectsInput(initial.projectName.join(', '));
        } else {
            setProjectsInput(''); // Clear for new employee form
        }
    }, [initial, isEdit]);


    // Validation function
    const validate = () => {
        const newErrors = {};
        if (!e.firstName.trim()) newErrors.firstName = 'First Name is required.';
        if (!e.lastName.trim()) newErrors.lastName = 'Last Name is required.';
        if (!e.emailId.trim()) newErrors.emailId = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(e.emailId)) newErrors.emailId = 'Email is invalid.'; // Basic email format check
        if (!e.departmentName.trim()) newErrors.departmentName = 'Department is required.';
        if (!e.address.street.trim()) newErrors.street = 'Street is required.';
        if (!e.address.city.trim()) newErrors.city = 'City is required.';
        if (!e.address.country.trim()) newErrors.country = 'Country is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const save = async () => {
        if (!validate()) {
            console.log("Form has validation errors.");
            return; // Stop if validation fails
        }

        const payload = {
            firstName: e.firstName,
            lastName: e.lastName,
            emailId: e.emailId,
            departmentName: e.departmentName,
            address: e.address,
            projectNames: e.projectName // This is already an array
        };
        try {
            if (isEdit) await updateOne(initial.id, payload);
            else await createOne(payload);
            onSaved();
        } catch (error) {
            console.error("Error saving employee:", error);
            // Optionally, show a user-friendly error message
            alert("Failed to save employee. Please try again.");
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onCancel}></div>
            <dialog className="modal" open>
                <div className="modal__header">
                    <h2>{isEdit ? 'Edit Employee' : 'New Employee'}</h2>
                    <button onClick={onCancel} aria-label="Close form">×</button>
                </div>
                <div className="modal__body">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={e.firstName}
                            onChange={_ => { setE({ ...e, firstName: _.target.value }); setErrors({ ...errors, firstName: null }); }}
                            required // HTML5 validation
                        />
                        {errors.firstName && <p className="validation-message">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={e.lastName}
                            onChange={_ => { setE({ ...e, lastName: _.target.value }); setErrors({ ...errors, lastName: null }); }}
                            required
                        />
                        {errors.lastName && <p className="validation-message">{errors.lastName}</p>}
                    </div>

                    {/* Email (full width) */}
                    <div className="full-width-field"> {/* Add class for full width */}
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email" // Use type="email" for better browser validation
                            value={e.emailId}
                            onChange={_ => { setE({ ...e, emailId: _.target.value }); setErrors({ ...errors, emailId: null }); }}
                            required
                        />
                        {errors.emailId && <p className="validation-message">{errors.emailId}</p>}
                    </div>

                    {/* Department (full width) */}
                    <div className="full-width-field">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            value={e.departmentName}
                            onChange={_ => { setE({ ...e, departmentName: _.target.value }); setErrors({ ...errors, departmentName: null }); }}
                            required
                        />
                        {errors.departmentName && <p className="validation-message">{errors.departmentName}</p>}
                    </div>

                    {/* Projects (full width) */}
                    <div className="full-width-field">
                        <label htmlFor="projects">Projects</label>
                        <input
                            id="projects"
                            type="text"
                            // Use projectsInput for the input's value to allow typing spaces freely
                            value={projectsInput}
                            onChange={_ => {
                                const inputValue = _.target.value;
                                setProjectsInput(inputValue); // Update the input string immediately
                                // Update the actual projectName array after a slight delay or on blur,
                                // or when saving. For simplicity here, we'll parse it on every change.
                                // NOTE: This means if you type "A,B, C", it will immediately parse.
                                // If you want to allow free typing and only parse on blur/submit, adjust this.
                                setE({ ...e, projectName: inputValue.split(',').map(s => s.trim()).filter(s => s !== '') });
                            }}
                        />
                    </div>

                    {/* Address fields group */}
                    <div className="address-group">
                        <p style={{ gridColumn: 'span 2', margin: '0 0 10px 0', fontWeight: 'bold' }}>Address Details</p> {/* A clearer heading for the group */}
                        <div className="full-width-field"> {/* Street cần dài */}
                            <label htmlFor="street">Street</label>
                            <input
                                id="street"
                                type="text"
                                value={e.address.street}
                                onChange={_ => { setE({ ...e, address:{...e.address,street:_.target.value} }); setErrors({ ...errors, street: null }); }}
                                required
                            />
                            {errors.street && <p className="validation-message">{errors.street}</p>}
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input
                                id="city"
                                type="text"
                                value={e.address.city}
                                onChange={_ => { setE({ ...e, address:{...e.address,city:_.target.value} }); setErrors({ ...errors, city: null }); }}
                                required
                            />
                            {errors.city && <p className="validation-message">{errors.city}</p>}
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <input
                                id="country"
                                type="text"
                                value={e.address.country}
                                onChange={_ => { setE({ ...e, address:{...e.address,country:_.target.value} }); setErrors({ ...errors, country: null }); }}
                                required
                            />
                            {errors.country && <p className="validation-message">{errors.country}</p>}
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <button className="btn btn-primary" onClick={save}>
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                    <button className="btn btn-danger" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </dialog>
        </>
    );
}