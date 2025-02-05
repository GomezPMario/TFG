import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/images/LogoCAAB.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const baseURL = 'https://tfg-ojja.onrender.com';
// export const baseURL = 'http://localhost:5000';

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

            if (response.status === 200 && response.data.success) {
                const arbitro = response.data.arbitro;
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('arbitro', JSON.stringify(arbitro));
                localStorage.setItem('arbitroId', arbitro.id);
                console.log(arbitro);

                // Verifica que la respuesta tenga el arbitro
                if (response.data.arbitro) {
                    localStorage.setItem('permiso', response.data.arbitro.permiso);
                } else {
                    setError('Error en la respuesta del servidor');
                }

                onLogin();
                navigate('/consultas');
            }
        } catch (err) {
            console.error('Error:', err); // Para depurar
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
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
