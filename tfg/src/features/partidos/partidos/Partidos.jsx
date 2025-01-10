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
    // const [arbitroId, setArbitroId] = useState(null);

    const [isCreateInformeModalOpen, setIsCreateInformeModalOpen] = useState(false);
    const [arbitrosDelPartido, setArbitrosDelPartido] = useState([]);
    const [selectedArbitro, setSelectedArbitro] = useState(null);
    const [datosTabla, setDatosTabla] = useState([]);
    const [imagen, setImagen] = useState('');
    const [mecanica, setMecanica] = useState('');
    const [criterio, setCriterio] = useState('');
    const [controlPartido, setControlPartido] = useState('');
    const [valoracion, setValoracion] = useState('');

    const [selectedPartido, setSelectedPartido] = useState(null);

    const [categorias, setCategorias] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [campos, setCampos] = useState([]);

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

    // Fetch inicial
    useEffect(() => {
        fetchPartidos();
        fetchCategorias();
        fetchEquipos();
        fetchCampos();
    }, []);

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

    const fetchCategorias = async () => {
        try {
            const response = await fetch(`${baseURL}/api/categorias`);
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
    };

    const fetchEquipos = async () => {
        try {
            const response = await fetch(`${baseURL}/api/equipos`);
            const data = await response.json();
            setEquipos(data);
        } catch (error) {
            console.error("Error al obtener los equipos:", error);
        }
    };  

    const fetchCampos = async () => {
        try {
            const response = await fetch(`${baseURL}/api/campos`);
            const data = await response.json();
            setCampos(data);
        } catch (error) {
            console.error("Error al obtener los campos:", error);
        }
    };

    const handleRadioChange = (event) => {
        const partidoId = Number(event.target.value); // Convertimos el valor a número
        console.log('Valor recibido del radio button:', partidoId);
        setSelectedPartidoId(partidoId);
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

    const handlePartidoClick = async (partidoId) => {
        try {
            const response = await fetch(`${baseURL}/api/partidos/${partidoId}/detalles`);
            if (response.ok) {
                const data = await response.json();

                // Buscar IDs de relaciones
                const categoria = categorias.find(cat => cat.nombre === data.categoria);
                const equipoLocal = equipos.find(equipo => equipo.nombre === data.equipo_local);
                const equipoVisitante = equipos.find(equipo => equipo.nombre === data.equipo_visitante);
                const campo = campos.find(c => c.nombre === data.campo);

                // Crear el objeto completo con los IDs
                const partidoConIds = {
                    ...data,
                    categoria_id: categoria?.id || null,
                    equipo_local_id: equipoLocal?.id || null,
                    equipo_visitante_id: equipoVisitante?.id || null,
                    campo_id: campo?.id || null,
                };

                console.log("Partido con IDs y Fecha:", partidoConIds); // Depuración
                setSelectedPartido(partidoConIds); // Actualizar estado
            } else {
                alert("No se pudieron obtener los detalles del partido.");
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            alert("Error al conectar con la API.");
        }
    };


    const handleUpdateField = async (field, value) => {
        if (!selectedPartido) return;

        let updatedField = { [field]: value };

        // Si el campo actualizado es `fecha_partido`, descomponerlo en `dia` y `hora`
        if (field === 'fecha_partido') {
            const [dia, hora] = value.split('T');
            updatedField = { dia, hora };
        }

        try {
            const response = await fetch(`${baseURL}/api/partidos/${selectedPartido.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedField),
            });

            if (response.ok) {
                setSelectedPartido((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            } else {
                console.error(`Error al actualizar ${field}:`, await response.text());
            }
        } catch (error) {
            console.error(`Error al actualizar ${field}:`, error);
        }
    };

    
    useEffect(() => {
        console.log("Estado de selectedPartido actualizado:", selectedPartido);
    }, [selectedPartido]);

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
                            <HiDocumentAdd className="interactive-icon" onClick={openCreateInformeModal} />
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
                            <tr
                                key={index}
                                onClick={() => handlePartidoClick(partido.partido_id)} // Llama a la función con el ID del partido
                                style={{ cursor: 'pointer' }} // Cambia el cursor para indicar interactividad
                            >
                                {/* Primera columna: Aquí se detiene la propagación del clic */}
                                <td
                                    onClick={(event) => event.stopPropagation()}
                                >
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
                            <td colSpan="7">No hay partidos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedPartido && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setSelectedPartido(null)}>&times;</span>
                        <h2>Detalles del Partido</h2>
                        <label>
                            <strong>Fecha:</strong>
                            <input
                                type="date"
                                value={selectedPartido?.fecha_encuentro?.split(' ')[0].split('/').reverse().join('-') || ''} // Formatea la fecha de dd/mm/yyyy a yyyy-mm-dd
                                onChange={(e) => {
                                    const nuevaFecha = e.target.value.split('-').reverse().join('/'); // Convierte yyyy-mm-dd a dd/mm/yyyy
                                    const horaActual = selectedPartido?.fecha_encuentro?.split(' ')[1] || '00:00';
                                    handleUpdateField('fecha_encuentro', `${nuevaFecha} ${horaActual}`);
                                }}
                            />
                        </label>
                        <br /><br />
                        <label>
                            <strong>Hora:</strong>
                            <input
                                type="time"
                                value={selectedPartido?.fecha_encuentro?.split(' ')[1]?.slice(0, 5) || '00:00'} // Toma la hora de "hh:mm:ss" o "hh:mm"
                                onChange={(e) => {
                                    const nuevaHora = e.target.value;
                                    const fechaActual = selectedPartido?.fecha_encuentro?.split(' ')[0] || '01/01/1970';
                                    handleUpdateField('fecha_encuentro', `${fechaActual} ${nuevaHora}`);
                                }}
                            />
                        </label>
                        <br /><br />
                        <label>
                            <strong>Categoría:</strong>
                            <select
                                value={selectedPartido?.categoria_id || ''}
                                onChange={(e) => handleUpdateField('categoria_id', e.target.value)}
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br /><br />
                        <label>
                            <strong>Equipo Local:</strong>
                            <select
                                value={selectedPartido?.equipo_local_id || ''}
                                onChange={(e) => handleUpdateField('equipo_local_id', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un equipo</option>
                                {equipos.map((equipo) => (
                                    <option key={equipo.id} value={equipo.id}>
                                        {equipo.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br /><br />
                        <label>
                            <strong>Equipo Visitante:</strong>
                            <select
                                value={selectedPartido?.equipo_visitante_id || ''}
                                onChange={(e) => handleUpdateField('equipo_visitante_id', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un equipo</option>
                                {equipos.map((equipo) => (
                                    <option key={equipo.id} value={equipo.id}>
                                        {equipo.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br /><br />
                        <label>
                            <strong>Campo:</strong>
                            <select
                                value={selectedPartido?.campo_id || ''}
                                onChange={(e) => handleUpdateField('campo_id', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un campo</option>
                                {campos.map((campo) => (
                                    <option key={campo.id} value={campo.id}>
                                        {campo.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <h3>Árbitros</h3>
                        {selectedPartido.arbitros?.length > 0 ? (
                            <>
                                <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                                    {selectedPartido.arbitros
                                        .sort((a, b) => {
                                            const order = {
                                                "Principal": 1,
                                                "Auxiliar 1": 2,
                                                "Auxiliar 2": 3,
                                                "Anotador": 4,
                                                "Cronometrador": 5,
                                                "24 segundos": 6,
                                                "Ayudante de Anotador": 7,
                                            };
                                            return (order[a.funcion] || 999) - (order[b.funcion] || 999);
                                        })
                                        .map((arbitro, idx) => (
                                            <li
                                                key={idx}
                                                style={{
                                                    marginBottom: '10px',
                                                    textAlign: 'left',
                                                    paddingLeft: '10px',
                                                }}
                                            >
                                                - <strong>{arbitro.funcion || 'Sin función'}</strong> - {arbitro.alias || '--'} - {arbitro.nombre || '--'} {arbitro.apellido || '--'} - {arbitro.telefono || 'Sin teléfono'}
                                            </li>
                                        ))}
                                </ul>

                                {/* Tabla con desplazamiento, suspendido y dieta */}
                                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Desplazamiento</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Suspendido</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Dieta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {selectedPartido.arbitros.map((arbitro, idx) => (
                                                    <div key={idx} style={{ marginBottom: '10px' }}>
                                                        {arbitro.alias || '--'}:
                                                        <input
                                                            type="number"
                                                            style={{
                                                                marginLeft: '10px',
                                                                padding: '5px',
                                                                width: '80px',
                                                                textAlign: 'right',
                                                            }}
                                                            placeholder="€"
                                                        />
                                                    </div>
                                                ))}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    style={{
                                                        transform: 'scale(1.5)',
                                                        marginLeft: 'auto',
                                                        marginRight: 'auto',
                                                    }}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    style={{
                                                        transform: 'scale(1.5)',
                                                        marginLeft: 'auto',
                                                        marginRight: 'auto',
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Tabla Informes */}
                                <h3>
                                    Informe realizado por <strong>{selectedPartido.tecnico || 'Sin técnico'} </strong>
                                    el día <strong>{selectedPartido.fecha_informe || 'Sin fecha'}</strong>
                                </h3>
                                {selectedPartido.arbitros?.length > 0 ? (
                                    (() => {
                                        const arbitrosRelevantes = selectedPartido.arbitros.filter(
                                            (arbitro) =>
                                                arbitro.funcion === "Principal" ||
                                                arbitro.funcion === "Auxiliar 1" ||
                                                arbitro.funcion === "Auxiliar 2"
                                        );

                                        const tieneInformes = arbitrosRelevantes.some(
                                            (arbitro) =>
                                                arbitro.imagen ||
                                                arbitro.mecanica ||
                                                arbitro.criterio ||
                                                arbitro.control_partido ||
                                                arbitro.valoracion
                                        );

                                        if (!tieneInformes) {
                                            return <p>No se ha realizado informes para ninguno de los colegiados.</p>;
                                        }

                                        return (
                                            <div className="informes-container">
                                                <table
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '20px',
                                                        borderCollapse: 'collapse',
                                                        tableLayout: 'fixed', // Fuerza las celdas a respetar el ancho disponible
                                                        wordWrap: 'break-word', // Envuelve el contenido en las celdas
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            {arbitrosRelevantes.map((arbitro) => (
                                                                <th
                                                                    key={arbitro.id}
                                                                    style={{
                                                                        border: '1px solid #ddd',
                                                                        padding: '8px',
                                                                        textAlign: 'center',
                                                                        backgroundColor: '#f2f2f2',
                                                                    }}
                                                                >
                                                                    {arbitro.alias || "Sin alias"}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            {arbitrosRelevantes.map((arbitro) => (
                                                                <td
                                                                    key={arbitro.id}
                                                                    style={{
                                                                        border: '1px solid #ddd',
                                                                        padding: '8px',
                                                                        textAlign: 'left',
                                                                        wordBreak: 'break-word', // Rompe las palabras largas en varias líneas
                                                                    }}
                                                                >
                                                                    <p style={{ marginBottom: '10px' }}>
                                                                        <strong>Imagen:</strong> {arbitro.imagen || "Sin datos"}
                                                                    </p>
                                                                    <p style={{ marginBottom: '10px' }}>
                                                                        <strong>Mecánica:</strong> {arbitro.mecanica || "Sin datos"}
                                                                    </p>
                                                                    <p style={{ marginBottom: '10px' }}>
                                                                        <strong>Criterio:</strong> {arbitro.criterio || "Sin datos"}
                                                                    </p>
                                                                    <p style={{ marginBottom: '10px' }}>
                                                                        <strong>Control de Partido:</strong> {arbitro.control_partido || "Sin datos"}
                                                                    </p>
                                                                    <p style={{ marginBottom: '10px' }}>
                                                                        <strong>Valoración:</strong> {arbitro.valoracion || "Sin datos"}
                                                                    </p>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <p>No hay árbitros asignados</p>
                                )}

                            </>
                        ) : (
                            <p>No hay árbitros asignados</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partidos;
