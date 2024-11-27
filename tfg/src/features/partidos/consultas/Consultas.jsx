import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../../components/login/Login';
import './Consultas.css';
import { IoMdAlarm } from "react-icons/io";
import { PiPrinterFill } from "react-icons/pi";

const formatDate = (dateString) => {
    const date = new Date(dateString.split('/').reverse().join('-'));
    let formattedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
        .format(date)
        .replace('.', '');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const Consultas = ({ arbitroId }) => {
    const [partidos, setPartidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCompanero, setSelectedCompanero] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);

    const handlePrint = () => {
        window.print();
    };

    const openModal = async (companero) => {
        setSelectedCompanero(companero);
        setIsModalOpen(true);

        try {
            const response = await axios.get(`${baseURL}/arbitros/foto/${companero.arbitro_id}`);
            setFotoPerfil(response.data.foto);
        } catch (error) {
            console.error("Error al obtener la foto de perfil:", error);
            setFotoPerfil(null); // Imagen de reemplazo en caso de error
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCompanero(null);
        setFotoPerfil(null);
    };

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

            <div className="button-container">
                <button className="button">
                    <IoMdAlarm /> Añadir disponibilidad
                </button>
                <button className="button" onClick={handlePrint}>
                    <PiPrinterFill /> Imprimir partidos
                </button>
            </div>

            {partidos.length > 0 ? partidos.map((partido, index) => (
                <div key={index} className="partido-card">
                    <table className="partido-table">
                        <tbody>
                            <tr>
                                <td><strong>Día</strong></td>
                                <td>{formatDate(partido.dia)}</td>
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
                                <td colSpan="3" className="companeros-td">
                                    {partido.companeros ? (
                                        (Array.isArray(JSON.parse(partido.companeros))
                                            ? JSON.parse(partido.companeros)
                                            : [JSON.parse(partido.companeros)]
                                        ).map((companero, idx) => (
                                            <div key={idx} className="companero-info" onClick={() => openModal(companero)}>
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

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="profile-photo">
                            {fotoPerfil ? (
                                <img src={fotoPerfil} alt="Foto de perfil" />
                            ) : (
                                <p>Foto no disponible</p>
                            )}
                        </div>
                        <h2>{selectedCompanero.alias}</h2>
                        <p>{selectedCompanero.nombre} {selectedCompanero.apellido}</p>
                        <p><strong>{selectedCompanero.telefono}</strong></p>
                        <p>{selectedCompanero.funcion}</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Consultas;
