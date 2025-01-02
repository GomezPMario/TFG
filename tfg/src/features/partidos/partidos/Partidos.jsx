import React, { useState, useEffect } from 'react';
import { IoCreateOutline } from "react-icons/io5";
import { CgImport } from "react-icons/cg";
import { baseURL } from '../../../components/login/Login';
import './Partidos.css';
import { HiDocumentAdd } from "react-icons/hi";

const Partidos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [partidos, setPartidos] = useState([]); // Estado para almacenar los datos de la tabla
    // const [selectedPartidos, setSelectedPartidos] = useState([]); // Estado para captchas seleccionados

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null); // Restablece el archivo cuando se cierra el modal
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
    };

    const handleFileSelect = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("/api/partidos/importar", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    alert("Archivo importado con éxito");
                    fetchPartidos(); // Refresca los datos de la tabla después de la importación
                } else {
                    alert("Error al importar el archivo");
                }
            } catch (error) {
                console.error("Error al subir el archivo:", error);
                alert("Error al subir el archivo");
            }
            closeModal();
        }
    };

    const formatFecha = (fecha, incluirHora = false) => {
        if (!fecha || fecha === '--') return '--'; // Manejo de valores vacíos o nulos
        const fechaObj = new Date(fecha);
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes es base 0
        const anio = fechaObj.getFullYear();

        if (incluirHora) {
            const horas = String(fechaObj.getHours()).padStart(2, '0');
            const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
        }

        return `${dia}/${mes}/${anio}`;
    };

    const fetchPartidos = async () => {
        try {
            const response = await fetch(`${baseURL}/api/partidos`);
            console.log("Response status:", response.status); // Verifica el estado de la respuesta
            if (response.ok) {
                const data = await response.json();
                setPartidos(data);
            } else {
                console.error("Error al obtener los datos de los partidos");
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
    };

    useEffect(() => {
        fetchPartidos(); // Llama a la API cuando el componente se monta
    }, []);

    return (
        <div className="partidos-container">
            <h1 className="partidos-title">Listado de Partidos-Informes</h1>

            <button className="button">
                <IoCreateOutline style={{ marginRight: '8px' }} />
                Crear Partido
            </button>
            <button className="button" onClick={openModal}>
                <CgImport style={{ marginRight: '8px' }} />
                Generar Designación
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Importar Partidos</h2>
                        <div
                            className="drag-drop-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            {file ? (
                                <p>Archivo seleccionado: {file.name}</p>
                            ) : (
                                <p>Arrastra y suelta un archivo aquí o haz clic para seleccionar uno</p>
                            )}
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                ref={(input) => input && input.click()}
                            />
                        </div>
                        <button onClick={handleFileUpload}>Subir Archivo</button>
                    </div>
                </div>
            )}

            {/* Tabla de partidos */}
            <table className="partidos-table">
                <thead>
                    <tr>
                        <th>
                            <HiDocumentAdd className="interactive-icon" />
                        </th>
                        <th>Técnico</th>
                        <th>Árbitro(s)</th>
                        <th>Categoría</th>
                        <th>Equipos</th>
                        <th>Fecha Partido</th>
                        <th>Fecha Informe</th>
                    </tr>
                </thead>
                <tbody>
                    {partidos.length > 0 ? (
                        partidos.map((partido, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="radio-container">
                                        <input
                                            type="radio"
                                            name="partido"
                                            value={partido.id}
                                        />
                                    </div>
                                </td>
                                <td>{partido.tecnico}</td>
                                <td className="arbitros-cell">
                                    {partido.arbitros ? (
                                        partido.arbitros.split(',').map((arbitro, idx) => {
                                            const [alias, nombre, apellido] = arbitro.trim().split(' ');
                                            return (
                                                <div key={idx}>
                                                    ({alias || '--'}) - {nombre || '--'} {apellido || '--'}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>--</div>
                                    )}
                                </td>


                                <td>{partido.categoria}</td>
                                <td>{partido.equipos}</td>
                                <td>{formatFecha(partido.fecha_partido, true)}</td>
                                <td>{formatFecha(partido.fecha_informe)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay partidos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Partidos;
