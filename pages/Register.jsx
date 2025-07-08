import React, { useState } from 'react';
import { register } from '../api/auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Default role is EMPLOYEE and not exposed in UI
    const role = 'EMPLOYEE';

    const handleSubmit = async e => {
        e.preventDefault();
        await register(username, password, role);
        window.location.href = '/login';
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <h2>Register</h2>
            <div className="input-box">
                <label className="details">Username</label>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
            </div>
            <div className="input-box">
                <label className="details">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
            </div>
            {/* Role is default EMPLOYEE, hidden from user */}
            <button type="submit" className="btn">Register</button>
        </form>
    );
};

export default Register;