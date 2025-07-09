import React, { useState } from 'react';
import { register } from '../api/auth';
import '../Login.css';
import {Link} from "react-router-dom";
import '../index.css';

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
        <div className="login-page-container">
            <form onSubmit={handleSubmit} className="login-form">
                <Link to="/login" className="btn"> ← Back</Link>
                <h2 className="login-title"> Register </h2>
            <div className="input-group">
                <label htmlFor="username-input" className={"sr-only"}>Username</label>
                <input
                    id="username-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    required // Make username a required field
                    aria-label="Enter your username"
                />
            </div>
                {/*Input PASSWORD*/}
                <div className="input-group">
                    <label htmlFor="password-input" className={"sr-only"}>Password</label>
                    <input
                        id="password-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                        aria-label="Enter your password"
                    />
                </div>
            {/* Role is default EMPLOYEE, hidden from user */}
            <button type="submit" className="login-button">Sign up</button>
        </form>
        </div>
    );
};

export default Register;