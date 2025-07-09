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
        projectName: []
    });

    useEffect(() => {
        if (isEdit) {
            setE({
                firstName: initial.firstName,
                lastName: initial.lastName,
                emailId: initial.emailId,
                departmentName: initial.departmentName,
                address: initial.address || { street:'',city:'',country:'' },
                projectName: initial.projectName
            });
        }
    }, [initial]);

    const save = async () => {
        const payload = {
            firstName: e.firstName,
            lastName: e.lastName,
            emailId: e.emailId,
            departmentName: e.departmentName,
            address: e.address,
            projectNames: e.projectName
        };
        if (isEdit) await updateOne(initial.id, payload);
        else await createOne(payload);
        onSaved();
    };

    return (
        <dialog className="modal" open>
            <div className="modal__header">
                <h2>{isEdit ? 'Edit Employee' : 'New Employee'}</h2>
                <button onClick={onCancel}>×</button>
            </div>
            <div className="modal__body">
                <label>First Name</label>
                <input
                    value={e.firstName}
                    onChange={_ => setE({ ...e, firstName: _.target.value })}
                />
                <label>Last Name</label>
                <input
                    value={e.lastName}
                    onChange={_ => setE({ ...e, lastName: _.target.value })}
                />
                <label>Email</label>
                <input
                    value={e.emailId}
                    onChange={_ => setE({ ...e, emailId: _.target.value })}
                />
                <label>Department</label>
                <input
                    value={e.departmentName}
                    onChange={_ => setE({ ...e, departmentName: _.target.value })}
                />
                <label>Projects (comma-sep)</label>
                <input
                    value={e.projectName.join(',')}
                    onChange={_ => setE({ ...e, projectName: _.target.value.split(',') })}
                />
                {/** Address fields */}
                <label>Street</label>
                <input
                    value={e.address.street}
                    onChange={_ => setE({ ...e, address:{...e.address,street:_.target.value} })}
                />
                <label>City</label>
                <input
                    value={e.address.city}
                    onChange={_ => setE({ ...e, address:{...e.address,city:_.target.value} })}
                />
                <label>Country</label>
                <input
                    value={e.address.country}
                    onChange={_ => setE({ ...e, address:{...e.address,country:_.target.value} })}
                />
            </div>
            <div className="modal__footer">
                <button className="btn" onClick={save}>
                    {isEdit ? 'Update' : 'Create'}
                </button>
                <button className="btn btn-danger" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </dialog>
    );
}
