import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from './Login';

const Consultas = ({ arbitroId }) => {
    const [partidos, setPartidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Control de carga

    useEffect(() => {
        const fetchPartidos = async (id) => {
            try {
                const response = await axios.get(`${baseURL}/partidos/${id}`);
                setPartidos(response.data);
            } catch (error) {
                console.error("Error al obtener los partidos:", error);
            } finally {
                setIsLoading(false); // Termina la carga después de obtener la respuesta
            }
        };

        if (arbitroId) {
            fetchPartidos(arbitroId);
        }
    }, [arbitroId]);

    // Renderizar un mensaje de carga hasta que arbitroId esté disponible
    if (isLoading) {
        return <p>Cargando partidos...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Partidos a Arbitrar</h1>
            {partidos.length > 0 ? partidos.map((partido, index) => (
                <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td><strong>Día</strong></td>
                                <td>{partido.dia}</td>
                                <td><strong>Hora</strong></td>
                                <td>{partido.hora}</td>
                            </tr>
                            <tr>
                                <td><strong>Función</strong></td>
                                <td>{partido.funcion}</td>
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
                                <td colSpan="3">{partido.anotador}</td>
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
