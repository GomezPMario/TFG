import React, { useState } from 'react';
import './styles/Login.css';
import logo from '../components/images/LogoCAAB.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = 'https://tfg-ojja.onrender.com';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${baseURL}/login`, {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Llamamos a onLogin cuando el login es exitoso
                onLogin();
                navigate('/consultas');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-image" />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuario"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Iniciar Sesión</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
