import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router";
import AuthContext from '../context/AuthContext';
import '../Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/'); // go to dashboard
        } catch (err) {
            setError("Invalid login credentials");
        }
        // window.location.href = '/';
    };

    return (
        // Main container cho login page, centers the form vertically and horizontally
        <div className="login-page-container">
            {/* Form login */}
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="login-title"> Login </h2>
                {/*Hiện lỗi nếu có*/}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {/*Input USERNAME*/}
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

                <button type="submit" className="login-button">Login</button>
                <p>Don't have an account? <b><a href="/register" >Register</a></b></p>

            </form>
        </div>
    );
};

export default Login;