import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../../components/login/Login';
import './Consultas.css';
import { IoMdAlarm } from "react-icons/io";
import { PiPrinterFill } from "react-icons/pi";
import { TbScoreboard } from "react-icons/tb";

const ModalFormStep = ({ isOpen, onClose, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(1); // Paso actual
    const [selectedOptions, setSelectedOptions] = useState([]); // "Variable", "Fija" o ["Variable", "Fija"]
    const [selectedDays, setSelectedDays] = useState([]); // Días seleccionados
    const [currentDayIndex, setCurrentDayIndex] = useState(0); // Índice del día actual
    const [availabilityType, setAvailabilityType] = useState(""); // Variable o Fija
    const [hourRangeVariable, setHourRangeVariable] = useState({ start: "", end: "" }); // Horas para disponibilidad variable
    const [hourRangeFija, setHourRangeFija] = useState({ start: "", end: "" }); // Horas para disponibilidad fija
    const [availabilityData, setAvailabilityData] = useState({ Variable: [], Fija: [] }); // Almacena los datos de disponibilidad por tipo

    const dayNames = {
        L: "LUNES",
        M: "MARTES",
        X: "MIÉRCOLES",
        J: "JUEVES",
        V: "VIERNES",
        S: "SÁBADO",
        D: "DOMINGO",
    };

    const handleOptionClick = (option) => {
        if (option === "Ambas") {
            setSelectedOptions(["Variable", "Fija"]);
        } else {
            setSelectedOptions([option]);
        }
    };

    const handleDayClick = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
        console.log('Días seleccionados:', selectedDays);
    };

    const handleBack = () => {
        if (currentStep === 3 && currentDayIndex > 0) {
            setCurrentDayIndex((prev) => prev - 1); // Retrocede al día anterior
            if (availabilityType === "Variable") setHourRangeVariable({ start: "", end: "" });
            else setHourRangeFija({ start: "", end: "" });
        } else if (currentStep === 3 && currentDayIndex === 0 && availabilityType === "Fija" && selectedOptions.includes("Variable")) {
            // Cambia de "Fija" a "Variable"
            setAvailabilityType("Variable");
            setSelectedDays(availabilityData.Variable.map((item) => item.day)); // Restaura los días de "Variable"
            setCurrentDayIndex(availabilityData.Variable.length - 1);
        } else if (currentStep === 3 && availabilityType === "Variable" && selectedOptions.includes("Fija")) {
            // Cambia al paso de selección de días para "Fija"
            setSelectedDays([]); // Resetea los días seleccionados
            setAvailabilityType("Fija");
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setSelectedDays([]); // Resetea los días seleccionados
            setCurrentStep(1); // Regresa al paso 1
        }
    };

    const handleSubmit = () => {
        if (currentStep === 1) {
            setCurrentStep(2); // Avanza al paso 2
            setAvailabilityType(selectedOptions[0]); // Define el primer tipo de disponibilidad
        } else if (currentStep === 2) {
            setCurrentStep(3); // Avanza al paso 3
        } else if (currentStep === 3) {
            const currentHourRange = availabilityType === "Variable" ? hourRangeVariable : hourRangeFija;

            const currentDayAvailability = {
                type: availabilityType,
                day: selectedDays[currentDayIndex],
                start: currentHourRange.start,
                end: currentHourRange.end,
            };

            // Generar una copia actualizada
            const updatedAvailabilityData = {
                ...availabilityData,
                [availabilityType]: [...availabilityData[availabilityType], currentDayAvailability],
            };

            console.log('Datos acumulados antes del envío:', updatedAvailabilityData);

            // Guardar los datos temporalmente
            setAvailabilityData(updatedAvailabilityData);

            if (currentDayIndex < selectedDays.length - 1) {
                setCurrentDayIndex((prev) => prev + 1); // Avanza al siguiente día
                if (availabilityType === "Variable") setHourRangeVariable({ start: "", end: "" });
                else setHourRangeFija({ start: "", end: "" });
            } else if (availabilityType === "Variable" && selectedOptions.includes("Fija")) {
                // Guarda los datos de "Variable" antes de cambiar a "Fija"
                setAvailabilityData({
                    ...updatedAvailabilityData,
                    Variable: [...updatedAvailabilityData.Variable],
                });

                // Cambia a "Fija"
                setAvailabilityType("Fija");
                setSelectedDays([]); // Resetea los días seleccionados
                setCurrentStep(2); // Regresa al paso 2 para seleccionar los días de "Fija"
            } else {
                // Finaliza la iteración
                const arbitroId = parseInt(localStorage.getItem('arbitroId'), 10);

                if (!arbitroId) {
                    console.error('Error: No se encontró el ID del árbitro en localStorage.');
                    return; // Detén el proceso si falta el ID
                }

                if (!updatedAvailabilityData.Variable.length && !updatedAvailabilityData.Fija.length) {
                    console.error('Error: No hay datos de disponibilidad para enviar.');
                    return; // Detén el proceso si los datos están vacíos
                }

                const dataToSubmit = {
                    arbitro_id: arbitroId,
                    availabilityData: updatedAvailabilityData,
                };

                fetch(`${baseURL}/api/disponibilidad`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((result) => {
                        if (result.success) {
                            console.log('Disponibilidad guardada correctamente:', result.message);
                            onClose(); // Cierra el modal después de guardar
                        } else {
                            console.error('Error al guardar disponibilidad:', result.message);
                        }
                    })
                    .catch((error) => console.error('Error en la solicitud:', error));
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-step-overlay">
            <div className="modal-step-content">
                <span className="modal-step-close" onClick={onClose}>&times;</span>
                {currentStep === 1 && (
                    <>
                        <h2 className="modal-step-title">Añadir Disponibilidad</h2>
                        <div className="modal-step-availability-options">
                            {["Variable", "Fija", "Ambas"].map((option, index) => (
                                <div
                                    key={index}
                                    className={`modal-step-option-row ${(option === "Ambas" &&
                                        selectedOptions.includes("Variable") &&
                                        selectedOptions.includes("Fija")) ||
                                        selectedOptions.includes(option)
                                        ? "selected"
                                        : ""
                                    }`}
                            onClick={() => handleOptionClick(option)}
                                >
                            {option.toUpperCase()}
                        </div>
                            ))}
                    </div>
                <button
                    className="modal-step-submit-button"
                    onClick={handleSubmit}
                    disabled={selectedOptions.length === 0}
                >
                    Continuar
                </button>
            </>
                )}
            {currentStep === 2 && (
                <>
                    <h2 className="modal-step-title">
                        Selecciona los Días (<span className="modal-step-underline">{availabilityType.toUpperCase()}</span>)
                    </h2>
                    <div className="modal-step-days-container">
                        {Object.keys(dayNames).map((day, index) => (
                            <div
                                key={index}
                                className={`modal-step-day-checkbox ${selectedDays.includes(day) ? "selected" : ""}`}
                        onClick={() => handleDayClick(day)}
                                >
                        {day}
                    </div>
                            ))}
                </div>
            <div className="modal-step-button-container">
                <button className="modal-step-back-button" onClick={handleBack}>
                    Atrás
                </button>
                <button
                    className="modal-step-submit-button"
                    onClick={handleSubmit}
                    disabled={selectedDays.length === 0}
                >
                    Continuar
                </button>
            </div>
        </>
    )
}
{
    currentStep === 3 && (
        <>
            <h2 className="modal-step-title">
                D. {availabilityType.charAt(0).toUpperCase() + availabilityType.slice(1)}: {dayNames[selectedDays[currentDayIndex]]}
            </h2>
            <p>
                <strong>Mañanas:</strong> 9:00 a 14:00 <br />
                <strong>Tardes:</strong> 14:01 a 22:00 <br />
                <strong>Noches:</strong> 22:01 a 8:59
            </p>
            <div className="modal-step-time-inputs">
                <label>
                    Hora Inicio
                    <input
                        type="time"
                        value={availabilityType === "Variable" ? hourRangeVariable.start : hourRangeFija.start}
                        onChange={(e) =>
                            availabilityType === "Variable"
                                ? setHourRangeVariable((prev) => ({ ...prev, start: e.target.value }))
                                : setHourRangeFija((prev) => ({ ...prev, start: e.target.value }))
                        }
                    />
                </label>
                <label>
                    Hora Fin
                    <input
                        type="time"
                        value={availabilityType === "Variable" ? hourRangeVariable.end : hourRangeFija.end}
                        onChange={(e) =>
                            availabilityType === "Variable"
                                ? setHourRangeVariable((prev) => ({ ...prev, end: e.target.value }))
                                : setHourRangeFija((prev) => ({ ...prev, end: e.target.value }))
                        }
                    />
                </label>
            </div>
            <div className="modal-step-button-container">
                <button className="modal-step-back-button" onClick={handleBack}>
                    Atrás
                </button>
                <button
                    className="modal-step-submit-button"
                    onClick={handleSubmit}
                    disabled={
                        !(availabilityType === "Variable"
                            ? hourRangeVariable.start && hourRangeVariable.end
                            : hourRangeFija.start && hourRangeFija.end)
                    }
                >
                    {currentDayIndex === selectedDays.length - 1 &&
                        !(availabilityType === "Variable" && selectedOptions.includes("Fija"))
                        ? "Guardar"
                        : "Continuar"}
                </button>
            </div>
        </>
    )}
            </div >
        </div >
    );
};

const formatDate = (dateString) => {
    if (!dateString) return "Fecha no válida";
    try {
        const date = new Date(dateString);
        let formattedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
            .format(date)
            .replace('.', '');
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return "Fecha no válida";
    }
};

const getThursdayInterval = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const offsetToPastThursday = (dayOfWeek < 4) ? -(7 - (4 - dayOfWeek)) : -(dayOfWeek - 4);
    const pastThursday = new Date(today);
    pastThursday.setDate(today.getDate() + offsetToPastThursday);

    const offsetToNextThursday = (dayOfWeek <= 4) ? (4 - dayOfWeek) : (7 - (dayOfWeek - 4));
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + offsetToNextThursday);

    return { pastThursday, nextThursday };
};

const Consultas = () => {
    const [partidos, setPartidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCompanero, setSelectedCompanero] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);

    const [selectedPartido, setSelectedPartido] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Modal Form-Step
    const [isModalFormOpen, setIsModalFormOpen] = useState(false);

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
            setFotoPerfil(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCompanero(null);
        setFotoPerfil(null);
    };

    const handleEditClick = (partidoId) => {
        const partido = partidos.find(p => p.partido_id === partidoId);
        setSelectedPartido(partido);
        setIsEditModalOpen(true);
    };

    const saveChanges = async () => {
        try {
            const response = await axios.put(`${baseURL}/api/partidos/${selectedPartido.partido_id}`, {
                resultado_a: selectedPartido.resultado_a,
                resultado_b: selectedPartido.resultado_b,
            });

            if (response.status === 200) {
                const updatedPartidos = partidos.map(p =>
                    p.partido_id === selectedPartido.partido_id ? selectedPartido : p
                );
                setPartidos(updatedPartidos);
                alert("Resultados actualizados correctamente");
            }
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Error al guardar los cambios");
        } finally {
            setIsEditModalOpen(false);
        }
    };

    useEffect(() => {
        const fetchPartidos = async () => {
            const arbitro = JSON.parse(localStorage.getItem('arbitro'));
            const arbitroId = arbitro?.id;

            if (!arbitroId) {
                console.error("No se encontró el ID del árbitro logueado.");
                setIsLoading(false);
                return;
            }

            const { pastThursday, nextThursday } = getThursdayInterval();
            const startDate = pastThursday.toISOString().split('T')[0];
            const endDate = nextThursday.toISOString().split('T')[0];

            try {
                const response = await axios.get(`${baseURL}/api/partidos/intervalo/${arbitroId}`, {
                    params: { startDate, endDate },
                });
                console.log('Datos recibidos:', response.data);
                setPartidos(response.data);
            } catch (error) {
                console.error("Error al obtener los partidos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartidos();
    }, []);

    const handleAddDisponibilityClick = () => {
        setIsModalFormOpen(true);
    };

    const closeModalForm = () => {
        setIsModalFormOpen(false);
    };

    const handleFormSubmit = (selectedOptions) => {
        console.log("Opciones seleccionadas:", selectedOptions);
        // Aquí puedes agregar la lógica para manejar las opciones seleccionadas
    };

    if (isLoading) {
        return <p>Cargando partidos...</p>;
    }

    return (
        <div className="consultas-container">
            <h1 className="consultas-title">Partidos a Arbitrar</h1>

            <div className="button-container">
                <button className="button" onClick={handleAddDisponibilityClick}>
                    <IoMdAlarm /> Añadir NO disponibilidad
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
                                <td colSpan="3">
                                    {partido.campo || "No se sabe"} - {partido.direccion || "En algún lugar del mundo"} - [
                                    {partido.ubicacion && (
                                        <a
                                            href={partido.ubicacion}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none', color: 'blue' }}
                                        >
                                            Ir aquí
                                        </a>
                                    )}]
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Compañeros</strong></td>
                                <td colSpan="3" className="companeros-td">
                                    {partido.companeros ? (() => {
                                        try {
                                            const ordenFunciones = [
                                                "Principal", "Auxiliar 1", "Auxiliar 2", "Anotador", "Cronometrador", "24 segundos", "Ayudante de Anotador"
                                            ];

                                            const companeros = JSON.parse(partido.companeros) || [];
                                            return companeros
                                                .filter(c => c.funcion !== partido.mi_funcion)
                                                .sort((a, b) => ordenFunciones.indexOf(a.funcion) - ordenFunciones.indexOf(b.funcion))
                                                .map((companero, idx) => (
                                                    <div key={idx} className="companero-info" onClick={() => openModal(companero)}>
                                                        <p>
                                                            <strong>{companero.funcion}</strong> - ({companero.numero_colegiado}) ({companero.alias}) - {companero.nombre} {companero.apellido} - {companero.telefono}
                                                        </p>
                                                    </div>
                                                ));
                                        } catch (error) {
                                            console.error("Error al analizar los compañeros:", error);
                                            return <p>El formato de los compañeros no es válido.</p>;
                                        }
                                    })() : <p>No hay compañeros asignados.</p>}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Notas</strong></td>
                                <td colSpan="3">{partido.notas || "Sin notas"}</td>
                            </tr>
                            {/* Botón "Editar partido" */}
                            <tr>
                                <td colSpan="4">
                                    <button
                                        className={`edit-button ${partido.resultado_a === 0 && partido.resultado_b === 0 ? "edit-button-yellow" : "edit-button-green"}`}
                                    onClick={() => handleEditClick(partido.partido_id)}
                                    >
                                    {partido.resultado_a === 0 && partido.resultado_b === 0 ? "Añadir resultado" : "Editar resultado"}
                                </button>
                                <span className="resultado-actual">
                                    <TbScoreboard />{partido.resultado_a} - {partido.resultado_b}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
    )) : <p>No hay partidos designados para usted.</p>
}

{
    isModalOpen && (
        <div className="consulta-modal">
            <div className="consulta-modal-content">
                <span className="consulta-modal-close" onClick={closeModal}>&times;</span>
                <div className="consulta-modal-profile-photo">
                    {fotoPerfil ? (
                        <img src={fotoPerfil} alt="Foto de perfil" />
                    ) : (
                        <img src="../../../assets/images/LogoCAAB.png" alt="Foto de perfil" />
                    )}
                </div>
                <h2>{selectedCompanero.alias}</h2>
                <p>{selectedCompanero.nombre} {selectedCompanero.apellido}</p>
                <p><strong>{selectedCompanero.telefono}</strong></p>
                <p>{selectedCompanero.funcion}</p>
            </div>
        </div>
    )
}

{
    isEditModalOpen && selectedPartido && (
        <div className="edit-modal">
            <div className="edit-modal-content">
                <span className="edit-modal-close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
                <h2>Añadir Resultado</h2>
                <form>
                    <label>
                        Equipo A:
                        <input
                            type="number"
                            value={selectedPartido.resultado_a || 0}
                            onChange={(e) =>
                                setSelectedPartido({ ...selectedPartido, resultado_a: parseInt(e.target.value, 10) || 0 })
                            }
                        />
                    </label>
                    <label>
                        Equipo B:
                        <input
                            type="number"
                            value={selectedPartido.resultado_b || 0}
                            onChange={(e) =>
                                setSelectedPartido({ ...selectedPartido, resultado_b: parseInt(e.target.value, 10) || 0 })
                            }
                        />
                    </label>
                    <button type="button" onClick={saveChanges}>
                        Guardar cambios
                    </button>
                </form>
            </div>
        </div>
    )
}

{/* Modal Form-Step */ }
<ModalFormStep
    isOpen={isModalFormOpen}
    onClose={closeModalForm}
    onSubmit={handleFormSubmit}
/>

        </div >
    );
};

export default Consultas;