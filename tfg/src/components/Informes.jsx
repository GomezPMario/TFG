// Informes.jsx
import React, { useState, useEffect } from 'react';
import './styles/Informes.css';
import { baseURL } from './Login';

const Informes = () => {
    const [informes, setInformes] = useState([]);

    useEffect(() => {
        const fetchInformes = async () => {
            try {
                const response = await fetch(`${baseURL}/informes`);
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
    }, []);

    return (
        <div className="informes-container">
            <h1 className="informes-title">Mis evaluaciones</h1>
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
                        <tr key={informe.id}>
                            <td>{informe.id}</td>
                            <td>{informe.titulo}</td>
                            <td>{informe.fecha}</td>
                            <td>{informe.autor}</td>
                            <td>{informe.categoria}</td>
                            <td>{informe.estado}</td>
                            <td>
                                <button className="action-button">Ver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Informes;
