import React, { useState } from 'react';
import './styles/Login.css';
import logo from '../components/images/LogoCAAB.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://tfg-sxm4.onrender.com';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Hook para redirección

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${baseURL}/login`, {
                username,
                password
            });

            if (response.status === 200) {
                console.log('Login successful');
                navigate('/consultas'); // Redirige a /consultas
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
