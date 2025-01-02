import React, { useState, useEffect } from 'react';
import './Informes.css';
import { baseURL } from '../../../components/login/Login';
import { RxCross2 } from "react-icons/rx";

const Informes = () => {
    const [informes, setInformes] = useState([]);
    const [arbitroId, setArbitroId] = useState(null);
    const [selectedInforme, setSelectedInforme] = useState(null); // Informe seleccionado para mostrar detalles
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleViewClick = (informe) => {
        setSelectedInforme(informe);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInforme(null);
    };

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
                                    <button
                                        className="action-button"
                                        onClick={() => handleViewClick(informe)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aún no ha sido evaluado por ningún técnico.</p>
            )}

            {isModalOpen && selectedInforme && (
                <div className="modal">
                    <div className="modal-content">
                        <RxCross2 className="close-button" onClick={handleCloseModal} />
                        <h2>Detalle del Informe</h2>
                        <table className="informes-table">
                            <thead>
                                <tr>
                                    <th>Fecha del encuentro</th>
                                    <th>Categoría</th>
                                    <th>Equipo Local</th>
                                    <th>Equipo Visitante</th>
                                    <th>Campo</th>
                                    <th>Técnico</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{selectedInforme.fecha_encuentro}</td>
                                    <td>{selectedInforme.categoria}</td>
                                    <td>{selectedInforme.equipo_local}</td>
                                    <td>{selectedInforme.equipo_visitante}</td>
                                    <td>{selectedInforme.campo}</td>
                                    <td>{selectedInforme.tecnico}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="detalle-informe-extra">
                            <p>
                                <strong>Imagen:</strong><br />{selectedInforme.imagen}
                            </p>
                            <p>
                                <strong>Mecánica (Cola - Cabeza):</strong><br />{selectedInforme.mecanica}
                            </p>
                            <p>
                                <strong>Criterio:</strong><br />{selectedInforme.criterio}
                            </p>
                            <p>
                                <strong>Control de Partido:</strong><br />{selectedInforme.control_partido}
                            </p>
                            <p>
                                <strong>Valoración:</strong><br />{selectedInforme.valoracion}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Informes;
