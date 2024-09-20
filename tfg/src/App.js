import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Consultas from './components/Consultas';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
      <Router>
        <Routes>
          {/* Ruta de login */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />

          {/* Ruta protegida */}
          <Route
            path="/consultas"
            element={isAuthenticated ? <Consultas /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
  );
}

export default App;
