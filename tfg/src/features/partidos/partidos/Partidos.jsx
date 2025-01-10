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
    const [selectedPartidoId, setSelectedPartidoId] = useState(null);
    const [arbitroId, setArbitroId] = useState(null);

    const [isCreateInformeModalOpen, setIsCreateInformeModalOpen] = useState(false);
    const [arbitrosDelPartido, setArbitrosDelPartido] = useState([]);
    const [selectedArbitro, setSelectedArbitro] = useState(null);
    const [datosTabla, setDatosTabla] = useState([]);
    const [imagen, setImagen] = useState('');
    const [mecanica, setMecanica] = useState('');
    const [criterio, setCriterio] = useState('');
    const [controlPartido, setControlPartido] = useState('');
    const [valoracion, setValoracion] = useState('');


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
            if (response.ok) {
                const data = await response.json();
                console.log("Datos de partidos:", data); // Depuración
                setPartidos(data);
            } else {
                console.error("Error al obtener los datos de los partidos");
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
    };

    const handleRadioChange = (event) => {
        const partidoId = Number(event.target.value); // Convertimos el valor a número
        console.log('Valor recibido del radio button:', partidoId);
        setSelectedPartidoId(partidoId);
    };

    const handleCreateInforme = async () => {
        console.log('selectedPartidoId antes de la validación:', selectedPartidoId); // Depuración

        if (selectedPartidoId === null || selectedPartidoId === undefined) {
            alert('Por favor, selecciona un partido antes de continuar.');
            return;
        }

        console.log('Creando informe para partido ID:', selectedPartidoId); // Depuración

        try {
            const response = await fetch(`${baseURL}/api/informes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partido_id: selectedPartidoId, arbitro_id: arbitroId }),
            });

            if (response.ok) {
                alert('Informe creado con éxito.');
            } else {
                alert('Error al crear el informe.');
            }
        } catch (error) {
            console.error('Error al crear el informe:', error);
        }
    };

    const openCreateInformeModal = async () => {
        if (!selectedPartidoId) {
            alert("Por favor, selecciona un partido antes de continuar.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/partidos/${selectedPartidoId}/detalles`);
            if (response.ok) {
                const data = await response.json();
                setArbitrosDelPartido(data.arbitros || []); // Cargamos los árbitros
                setDatosTabla([data]); // Cargamos los datos del partido como array
                setIsCreateInformeModalOpen(true);
            } else {
                console.error("Error al obtener los detalles del partido");
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
    };


    const closeCreateInformeModal = () => {
        setIsCreateInformeModalOpen(false);
        setSelectedArbitro(null);
    };

    const handleArbitroChange = (event) => {
        setSelectedArbitro(event.target.value);
    };

    const handleSaveInforme = async () => {
        if (!selectedArbitro || !selectedPartidoId) {
            alert("Selecciona un árbitro y un partido antes de guardar.");
            return;
        }

        const storedArbitro = localStorage.getItem("arbitro");
        const evaluador = storedArbitro ? JSON.parse(storedArbitro) : null;
        const evaluadorId = evaluador?.id;

        if (!evaluadorId) {
            alert("Error: No se pudo obtener el ID del evaluador.");
            return;
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaActual = new Date().toISOString().split("T")[0];

        const data = {
            partido_id: selectedPartidoId,
            arbitro_id: selectedArbitro,
            evaluador_id: evaluadorId,
            fecha: fechaActual, // Solo la parte de la fecha
            imagen,
            mecanica,
            criterio,
            control_partido: controlPartido,
            valoracion,
        };

        try {
            const response = await fetch(`${baseURL}/api/informes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Informe guardado con éxito.");
                closeCreateInformeModal();
            } else {
                console.error("Error al guardar informe:", response.statusText);
                alert("Error al guardar el informe.");
            }
        } catch (error) {
            console.error("Error al guardar informe:", error);
            alert("Error al guardar el informe.");
        }
    };

    useEffect(() => {
        console.log('Estado de selectedPartidoId:', selectedPartidoId);
    }, [selectedPartidoId]);

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

            {isCreateInformeModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeCreateInformeModal}>&times;</span>
                        <h2>Crear informe para:</h2>
                        <select
                            className="dropdown-arbitros"
                            onChange={handleArbitroChange}
                            value={selectedArbitro || ""}
                        >
                            <option value="" disabled>Selecciona un árbitro</option>
                            {arbitrosDelPartido.map((arbitro, index) => (
                                <option key={index} value={arbitro.id}>
                                    {arbitro.alias} - {arbitro.nombre} {arbitro.apellido}
                                </option>
                            ))}
                        </select>

                        {/* Tabla debajo del dropdown */}
                        <div className="table-container">
                            <table className="tabla-datos">
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
                                    {Array.isArray(datosTabla) && datosTabla.length > 0 ? (
                                        datosTabla.map((dato, index) => (
                                            <tr key={index}>
                                                <td>{dato.fecha_encuentro || 'Sin fecha'}</td>
                                                <td>{dato.categoria || 'Sin categoría'}</td>
                                                <td>{dato.equipo_local || 'Sin equipo local'}</td>
                                                <td>{dato.equipo_visitante || 'Sin equipo visitante'}</td>
                                                <td>{dato.campo || 'Sin campo'}</td>
                                                <td>{dato.tecnico || 'Sin técnico'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No hay datos disponibles</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Inputs debajo de la tabla */}
                        <div className="form-container">
                            <label>
                                <strong>Imagen:</strong>
                                <textarea
                                    className="input-large"
                                    placeholder="Imagen"
                                    value={imagen}
                                    onChange={(e) => setImagen(e.target.value)}
                                ></textarea>
                            </label>

                            <label>
                                <strong>Mecánica (Cola - Cabeza):</strong>
                                <textarea
                                    className="input-large"
                                    placeholder="Mecánica (cola - cabeza)"
                                    value={mecanica}
                                    onChange={(e) => setMecanica(e.target.value)}
                                ></textarea>
                            </label>

                            <label>
                                <strong>Criterio:</strong>
                                <textarea
                                    className="input-large"
                                    placeholder="Criterio"
                                    value={criterio}
                                    onChange={(e) => setCriterio(e.target.value)}
                                ></textarea>
                            </label>

                            <label>
                                <strong>Control de partido:</strong>
                                <textarea
                                    className="input-large"
                                    placeholder="Control de partido"
                                    value={controlPartido}
                                    onChange={(e) => setControlPartido(e.target.value)}
                                ></textarea>
                            </label>

                            <label>
                                <strong>Valoración:</strong>
                                <textarea
                                    className="input-large"
                                    placeholder="Valoración"
                                    value={valoracion}
                                    onChange={(e) => setValoracion(e.target.value)}
                                ></textarea>
                            </label>

                            <button className="save-button" onClick={handleSaveInforme}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Tabla de partidos */}
            <table className="partidos-table">
                <thead>
                    <tr>
                        <th>
                            <HiDocumentAdd className="interactive-icon" onClick={openCreateInformeModal}/>
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
                                            value={partido.partido_id || ''} // Evita valores inesperados
                                            onChange={handleRadioChange}
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
