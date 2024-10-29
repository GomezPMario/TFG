import React, { useState, useEffect } from 'react';
import { IoTrashBinSharp, IoTrashBinOutline } from 'react-icons/io5'; // Importar ambos íconos
import { FiSend } from 'react-icons/fi';
import { baseURL } from './Login';
import './styles/Licencias.css';

const Licencias = ({ onClose }) => {
    const [licencias, setLicencias] = useState([]);
    const [newLicencia, setNewLicencia] = useState(''); // Estado para el nuevo número de colegiado
    const [message, setMessage] = useState(''); // Estado para el mensaje de confirmación
    const [hoveredId, setHoveredId] = useState(null); // Estado para el ícono en hover

    // Función para obtener las licencias
    const fetchLicencias = async () => {
        try {
            const response = await fetch(`${baseURL}/arbitros/licencia`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => a.numero_colegiado - b.numero_colegiado);
            setLicencias(sortedData);
        } catch (error) {
            console.error('Error fetching licencias:', error);
        }
    };

    useEffect(() => {
        fetchLicencias(); // Carga inicial de licencias
    }, []);

    const handleDelete = async (numeroColegiado) => {
        try {
            const response = await fetch(`${baseURL}/arbitros/licencia/${numeroColegiado}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (response.ok && result.message === 'Licencia eliminada correctamente') {
                setLicencias(prevLicencias =>
                    prevLicencias
                        .filter(licencia => licencia.numero_colegiado !== numeroColegiado)
                        .sort((a, b) => a.numero_colegiado - b.numero_colegiado)
                );
                setMessage(`Licencia ${numeroColegiado} eliminada correctamente`);
            } else {
                setMessage('Error al eliminar la licencia');
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
            setMessage('Error en la solicitud de eliminación');
        }

        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddLicencia = async () => {
        if (!newLicencia) return;

        try {
            const response = await fetch(`${baseURL}/arbitros/licencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ numero_colegiado: newLicencia })
            });
            const result = await response.json();

            if (response.ok && result.message === 'Licencia añadida correctamente') {
                setLicencias(prevLicencias => {
                    const updatedLicencias = [...prevLicencias, { numero_colegiado: newLicencia }]
                        .sort((a, b) => a.numero_colegiado - b.numero_colegiado);
                    return updatedLicencias;
                });
                setMessage(`Licencia ${newLicencia} añadida correctamente`);
                setNewLicencia('');
            } else {
                setMessage('Error al añadir la licencia');
            }
        } catch (error) {
            console.error('Error en la solicitud de inserción:', error);
            setMessage('Error en la solicitud de inserción');
        }

        setTimeout(() => setMessage(''), 3000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddLicencia();
        }
    };

    return (
        <div className="licencias-modal">
            <div className="licencias-content">
                <h2>Licencias Disponibles</h2>

                <div className="add-licencia-container">
                    <input
                        type="number"
                        value={newLicencia}
                        onChange={(e) => setNewLicencia(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Añadir número de colegiado"
                        className="input-new-licencia"
                    />
                    <button onClick={handleAddLicencia} className="button-send">
                        <FiSend />
                    </button>
                </div>

                {message && <p className="message">{message}</p>}

                <div className="licencias-table-container">
                    <table className="licencias-table">
                        <thead>
                            <tr>
                                <th>Número de Colegiado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licencias.map(colegiado => (
                                <tr key={colegiado.numero_colegiado}>
                                    <td>{colegiado.numero_colegiado}</td>
                                    <td>
                                        <button
                                            className="delete-icon"
                                            onClick={() => handleDelete(colegiado.numero_colegiado)}
                                            onMouseEnter={() => setHoveredId(colegiado.numero_colegiado)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            {hoveredId === colegiado.numero_colegiado ? (
                                                <IoTrashBinOutline />
                                            ) : (
                                                <IoTrashBinSharp />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="close-button" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default Licencias;
