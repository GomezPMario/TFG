import React, { useEffect, useState } from 'react';
import './styles/Perfil.css';

import { FaUser, FaEnvelope, FaPhone, FaHome, FaKey, FaTag } from 'react-icons/fa';
import { GiPencilRuler } from "react-icons/gi";

const Perfil = () => {
    const [arbitro, setArbitro] = useState(null);

    useEffect(() => {
        const storedArbitro = localStorage.getItem('arbitro');
        if (storedArbitro) {
            setArbitro(JSON.parse(storedArbitro));
        }
    }, []);

    if (!arbitro) {
        return <p>Loading...</p>;
    }

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                <h1>Perfil de {arbitro.nombre}</h1>
                <div className="perfil-content">
                    <div className="perfil-column">
                        <ul>
                            <li><FaUser className="icon" /> <strong>Usuario:</strong> {arbitro.username}</li>
                            <li><FaKey className="icon" /> <strong>Contraseña:</strong> {arbitro.password}</li>
                            <li><FaTag className="icon" /> <strong>Alias:</strong> {arbitro.alias}</li>
                            <li><FaTag className="icon" /> <strong>Número de Colegiado:</strong> {arbitro.numero_colegiado}</li>
                            <li><FaPhone className="icon" /> <strong>Teléfono:</strong> {arbitro.telefono}</li>
                        </ul>
                    </div>
                    <div className="perfil-column">
                        <ul>
                            <li><FaUser className="icon" /> <strong>Nombre:</strong> {arbitro.nombre}</li>
                            <li><FaUser className="icon" /> <strong>Apellido:</strong> {arbitro.apellido}</li>
                            <li><FaEnvelope className="icon" /> <strong>Email:</strong> {arbitro.email}</li>
                            <li><FaHome className="icon" /> <strong>Domicilio:</strong> {arbitro.domicilio}</li>
                            <li><FaUser className="icon" /> <strong>Cuenta:</strong> {arbitro.cuenta}</li>
                        </ul>
                    </div>
                    <div className="perfil-column">
                        <ul>
                            <li>
                                <FaTag className="icon" />
                                <strong>Permiso:</strong>
                                {arbitro.permiso === '1' && 'Admin'}
                                {arbitro.permiso === '2' && 'Técnico'}
                                {arbitro.permiso === '3' && 'Árbitro - Oficial'}
                            </li>
                            <li><FaTag className="icon" /> <strong>Categoría:</strong> {arbitro.categoria || 'N/A'} - {arbitro.subcategoria || 'N/A'}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <button className="editar-perfil-btn"><GiPencilRuler />Editar perfil</button>
        </div>
    );
};

export default Perfil;
