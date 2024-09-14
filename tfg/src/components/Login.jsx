import React, { useState } from 'react';
import './styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de autenticación
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Iniciar Sesión</h2>
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
            </form>
        </div>
    );
};

export default Login;