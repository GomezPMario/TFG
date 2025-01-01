import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import Perfil from './features/arbitros/perfil/Perfil';
import Consultas from './features/partidos/consultas/Consultas';
import Nominas from './features/arbitros/nominas/Nominas';
import Informes from './features/arbitros/informes/Informes';
// import Designacion from './components/Designacion';
import Arbitros from './features/arbitros/arbitros/Arbitros';
import NuevoArbitro from './features/arbitros/nuevoarbitro/NuevoArbitro';
import Campos from './features/equipos/campos/Campos';
import Categorias from './features/equipos/categorias/Categorias';
import Equipos from './features/equipos/equipos/Equipos';
import Tarifas from './features/configuracion/tarifas/Tarifas';
import Partidos from './features/partidos/partidos/Partidos';
import Miscelaneo from './features/configuracion/miscelaneo/Miscelaneo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

  const [arbitroId, setArbitroId] = useState(() => {
    const arbitro = JSON.parse(localStorage.getItem('arbitro'));
    return arbitro ? arbitro.id : null;
  });

  const [permiso, setPermiso] = useState(() => {
    const arbitro = JSON.parse(localStorage.getItem('arbitro'));
    return arbitro ? parseInt(arbitro.permiso, 10) : null; // Convertir permiso a número
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
    setPermiso(null);
  };

  const ProtectedRoute = ({ children, allowedPermissions }) => {
    console.log("Permiso actual (numérico):", permiso);
    console.log("Permisos permitidos:", allowedPermissions);

    if (!allowedPermissions.includes(permiso)) {
      console.log("Acceso denegado: redirigiendo a /consultas");
      return <Navigate to="/consultas" />;
    }
    console.log("Acceso permitido");
    return children;
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

  const InfoArbitro = () => {
    const { id } = useParams();
    return <Perfil arbitroId={id} />;
  };

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
              <Route path="/informes" element={<Informes arbitroId={arbitroId} />} />
              <Route
                path="/arbitros"
                element={
                  <ProtectedRoute allowedPermissions={[1]}>
                    <Arbitros />
                  </ProtectedRoute>
                }
              />
              <Route path="/arbitros/:id" element={
                <ProtectedRoute allowedPermissions={[1]}>
                  <InfoArbitro />
                </ProtectedRoute>
              } />
              <Route path="/campos" element={
                <ProtectedRoute allowedPermissions={[1]}>
                  <Campos />
                </ProtectedRoute>
              } />
              <Route path="/categorias" element={
                <ProtectedRoute allowedPermissions={[1]}>
                  <Categorias />
                </ProtectedRoute>
              } />
              <Route path="/equipos" element={
                <ProtectedRoute allowedPermissions={[1]}>
                  <Equipos />
                </ProtectedRoute>
              } />
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