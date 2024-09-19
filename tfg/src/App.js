import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Consusltas from './components/Consultas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/consultas" element={<Consusltas />} />
      </Routes>
    </Router>
  );
}

export default App;