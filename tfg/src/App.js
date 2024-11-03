import React, { useEffect, useState } from 'react';
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
import NuevoArbitro from './components/NuevoArbitro';
import Campos from './components/Campos';
import Categorias from './components/Categorias';
import Equipos from './components/Equipos';
import Tarifas from './components/Tarifas';
import Partidos from './components/Partidos';
import Miscelaneo from './components/Miscelaneo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

  const [arbitroId, setArbitroId] = useState(() => {
    const arbitro = JSON.parse(localStorage.getItem('arbitro'));
    return arbitro ? arbitro.id : null;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);

    // Cargar el arbitroId desde localStorage después de iniciar sesión
    const arbitro = JSON.parse(localStorage.getItem('arbitro'));
    if (arbitro) {
      setArbitroId(arbitro.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('arbitro'); // Elimina el arbitro
    setIsAuthenticated(false);
    setArbitroId(null);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token'); // Elimina el token al cerrar la pestaña
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/nuevoarbitro" element={<NuevoArbitro isPublic={true} onClose={() => { }} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar onLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/consultas" element={<Consultas arbitroId={arbitroId} />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/nominas" element={<Nominas arbitroId={arbitroId} />} />
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
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
