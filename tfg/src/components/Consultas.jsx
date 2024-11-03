import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from './Login';
import './styles/Consultas.css';


const Consultas = ({ arbitroId }) => {
    const [partidos, setPartidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPartidos = async (id) => {
            try {
                const response = await axios.get(`${baseURL}/partidos/${id}`);
                setPartidos(response.data);
            } catch (error) {
                console.error("Error al obtener los partidos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (arbitroId) {
            fetchPartidos(arbitroId);
        }
    }, [arbitroId]);

    if (isLoading) {
        return <p>Cargando partidos...</p>;
    }

    return (
        <div className="consultas-container">
            <h1 className="consultas-title">Partidos a Arbitrar</h1>
            {partidos.length > 0 ? partidos.map((partido, index) => (
                <div key={index} className="partido-card">
                    <table className="partido-table">
                        <tbody>
                            <tr>
                                <td><strong>Día</strong></td>
                                <td>{partido.dia}</td>
                                <td><strong>Hora</strong></td>
                                <td>{partido.hora}</td>
                            </tr>
                            <tr>
                                <td><strong>Función</strong></td>
                                <td>{partido.mi_funcion}</td>
                                <td><strong>Categoría</strong></td>
                                <td>{partido.categoria}</td>
                            </tr>
                            <tr>
                                <td><strong>Equipo A</strong></td>
                                <td>{partido.equipoA}</td>
                                <td><strong>Equipo B</strong></td>
                                <td>{partido.equipoB}</td>
                            </tr>
                            <tr>
                                <td><strong>Campo</strong></td>
                                <td colSpan="3">{partido.campo}</td>
                            </tr>
                            <tr>
                                <td><strong>Dirección</strong></td>
                                <td colSpan="3">{partido.direccion}</td>
                            </tr>
                            <tr>
                                <td><strong>Compañeros</strong></td>
                                <td colSpan="3">
                                    {partido.companeros ? (
                                        (Array.isArray(JSON.parse(partido.companeros))
                                            ? JSON.parse(partido.companeros)
                                            : [JSON.parse(partido.companeros)]
                                        ).map((companero, idx) => (
                                            <div key={idx} className="companero-info">
                                                <p><strong>{companero.funcion}</strong> - ({companero.numero_colegiado})({companero.alias}) - {companero.nombre} {companero.apellido} - {companero.telefono}</p>
                                                <hr />
                                            </div>
                                        ))
                                    ) : <p>No hay compañeros asignados.</p>}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Notas</strong></td>
                                <td colSpan="3">{partido.notas}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )) : <p>No hay partidos designados para usted.</p>}
        </div>
    );
};

export default Consultas;
