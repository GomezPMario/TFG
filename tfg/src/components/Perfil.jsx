import React, { useEffect, useState } from 'react';
import './styles/Perfil.css';

const Perfil = () => {
    const [arbitro, setArbitro] = useState(null);

    useEffect(() => {
        const storedArbitro = localStorage.getItem('arbitro');
        if (storedArbitro) {
            setArbitro(JSON.parse(storedArbitro));
        }
    }, []);

    if (!arbitro) {
        return <p>Loading...</p>; // O un spinner
    }

    return (
        <div className="perfil-container">
            <h1>Perfil del Árbitro</h1>
            <ul>
                <li><strong>Usuario:</strong> {arbitro.username}</li>
                <li><strong>Contraseña:</strong> {arbitro.password} </li>
                <li><strong>Alias:</strong> {arbitro.alias}</li>
                <li><strong>Número de Colegiado:</strong> {arbitro.numero_colegiado}</li>
                <li><strong>Nombre:</strong> {arbitro.nombre}</li>
                <li><strong>Apellido:</strong> {arbitro.apellido}</li>
                <li><strong>Teléfono:</strong> {arbitro.telefono}</li>
                <li><strong>Email:</strong> {arbitro.email}</li>
                <li><strong>Domicilio:</strong> {arbitro.domicilio}</li>
                <li><strong>Cuenta:</strong> {arbitro.cuenta}</li>
                <li><strong>Permiso:</strong> {arbitro.permiso}</li>
                <li><strong>Categoría:</strong> {arbitro.categoria || 'N/A'}</li>
                <li><strong>Subcategoría:</strong> {arbitro.subcategoria || 'N/A'}</li>

            </ul>
        </div>
    );
};

export default Perfil;
