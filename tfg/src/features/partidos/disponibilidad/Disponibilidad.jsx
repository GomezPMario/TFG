import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Disponibilidad.css';
import { baseURL } from '../../../components/login/Login';

const Disponibilidad = () => {
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDisponibilidades = async () => {
            const arbitro = JSON.parse(localStorage.getItem('arbitro'));
            const arbitroId = arbitro?.id;

            if (!arbitroId) {
                setError('No se encontró el ID del árbitro logueado.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseURL}/api/disponibilidad/${arbitroId}`);
                setDisponibilidades(response.data);
            } catch (error) {
                console.error('Error al obtener las disponibilidades:', error);
                setError('Hubo un error al cargar las disponibilidades.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDisponibilidades();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/disponibilidad/${id}`);
            setDisponibilidades((prev) => prev.filter((dispo) => dispo.id !== id));
        } catch (error) {
            console.error('Error al eliminar la disponibilidad:', error);
            alert('No se pudo eliminar la disponibilidad.');
        }
    };

    const capitalizeFirstLetter = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Sin hora';
        return timeString.slice(0, 5); // hh:mm
    };

    if (isLoading) {
        return <p>Cargando disponibilidades...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Ordenar disponibilidades: "Variable" primero, "Fija" después
    const sortedDisponibilidades = [...disponibilidades].sort((a, b) => {
        if (a.tipo_disponibilidad === 'variable' && b.tipo_disponibilidad === 'fija') return -1;
        if (a.tipo_disponibilidad === 'fija' && b.tipo_disponibilidad === 'variable') return 1;
        return 0;
    });

    return (
        <div className="disponibilidad-container">
            <h1 className="disponibilidad-title">NO Disponibilidad</h1>
            <table className="disponibilidad-table">
                <thead>
                    <tr>
                        <th>Eliminar</th>
                        <th>Tipo</th>
                        <th>Cuándo</th>
                        <th>Horas</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedDisponibilidades.length > 0 ? (
                        sortedDisponibilidades.map((dispo) => (
                            <tr key={dispo.id}>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(dispo.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                                <td>{capitalizeFirstLetter(dispo.tipo_disponibilidad)}</td>
                                <td>
                                    {dispo.fecha
                                        ? formatDate(dispo.fecha)
                                        : capitalizeFirstLetter(dispo.dia_semana)}
                                </td>
                                <td>
                                    {formatTime(dispo.hora_inicio)} - {formatTime(dispo.hora_fin)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay disponibilidades registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Disponibilidad;
