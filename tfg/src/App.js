import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Perfil from './components/Perfil';
import Consultas from './components/Consultas';
import Nominas from './components/Nominas';
import Informes from './components/Informes';
import Disponibilidad from './components/Disponibilidad';
import Designacion from './components/Designacion';
import Arbitros from './components/Arbitros';
import Campos from './components/Campos';
import Categorias from './components/Categorias';
import Equipos from './components/Equipos';
import Tarifas from './components/Tarifas';
import Partidos from './components/Partidos';
import Miscelaneo from './components/Miscelaneo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Si hay token, se considera autenticado
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Sidebar onLogout={handleLogout} />
          <Routes>
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/nominas" element={<Nominas />} />
            <Route path="/informes" element={<Informes />} />
            <Route path="/disponibilidad" element={<Disponibilidad />} />
            <Route path="/designacion" element={<Designacion />} />
            <Route path="/arbitros" element={<Arbitros />} />
            <Route path="/campos" element={<Campos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/tarifas" element={<Tarifas />} />
            <Route path="/partidos" element={<Partidos />} />
            <Route path="/miscelaneo" element={<Miscelaneo />} />
            <Route path="*" element={<Navigate to="/consultas" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
