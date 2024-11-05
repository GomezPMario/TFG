// Informes.jsx
import React, { useState, useEffect } from 'react';
import './styles/Informes.css';
import { baseURL } from './Login';

const Informes = () => {
    const [informes, setInformes] = useState([]);
    const [arbitroId, setArbitroId] = useState(null);

    useEffect(() => {
        const storedArbitro = localStorage.getItem('arbitro');
        if (storedArbitro) {
            const parsedArbitro = JSON.parse(storedArbitro);
            setArbitroId(parsedArbitro.id);
        }
    }, []);

    useEffect(() => {
        const fetchInformes = async () => {
            if (!arbitroId) return;

            try {
                const response = await fetch(`${baseURL}/api/informes?arbitro_id=${arbitroId}`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                setInformes(data);
            } catch (error) {
                console.error('Error fetching informes:', error);
            }
        };

        fetchInformes();
    }, [arbitroId]);

    return (
        <div className="informes-container">
            <h1 className="informes-title">Mis evaluaciones</h1>
            {informes.length > 0 ? (
                <table className="informes-table">
                    <thead>
                        <tr>
                            <th>Fecha del encuentro</th>
                            <th>Categoría</th>
                            <th>Equipo Local</th>
                            <th>Equipo Visitante</th>
                            <th>Campo</th>
                            <th>Técnico</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {informes.map((informe) => (
                            <tr key={informe.informe_id}>
                                <td>{informe.fecha_encuentro}</td>
                                <td>{informe.categoria}</td>
                                <td>{informe.equipo_local}</td>
                                <td>{informe.equipo_visitante}</td>
                                <td>{informe.campo}</td>
                                <td>{informe.tecnico}</td>
                                <td>
                                    <button className="action-button">Ver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Ningún técnico todavía no le ha realizado ningún informe.</p>
            )}
        </div>
    );
};

export default Informes;
