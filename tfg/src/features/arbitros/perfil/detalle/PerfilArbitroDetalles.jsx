import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../../../components/login/Login';

const PerfilArbitroDetalles = () => {
    const { id } = useParams(); // Obtiene el id del árbitro desde la URL
    const [arbitro, setArbitro] = useState(null);

    useEffect(() => {
        const fetchArbitro = async () => {
            try {
                const response = await fetch(`${baseURL}/arbitros/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles del árbitro');
                }
                const data = await response.json();
                setArbitro(data);
            } catch (error) {
                console.error('Error fetching arbitro:', error);
            }
        };

        fetchArbitro();
    }, [id]);

    if (!arbitro) {
        return <div>Cargando detalles del árbitro...</div>;
    }

    return (
        <div>
            <h1>Detalles del Árbitro</h1>
            <p><strong>Nombre:</strong> {arbitro.nombre}</p>
            <p><strong>Alias:</strong> {arbitro.alias}</p>
            <p><strong>Número Colegiado:</strong> {arbitro.numero_colegiado}</p>
            <p><strong>Permiso:</strong> {arbitro.permiso}</p>
            <p><strong>Teléfono:</strong> {arbitro.telefono}</p>
        </div>
    );
};

export default PerfilArbitroDetalles;
