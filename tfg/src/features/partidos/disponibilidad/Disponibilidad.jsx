import React, { useState } from 'react';
// import { IoMdAlarm } from "react-icons/io";
import './Disponibilidad.css';

const Disponibilidad = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal

    const handleOpenModal = () => {
        setIsModalOpen(true); // Abre el modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Cierra el modal
    };

    return (
        <div className="disponibilidad-container">
            <h1 className="disponibilidad-title">NO Disponibilidad</h1>

            {/* <div className="button-container">
                <button className="button" onClick={handleOpenModal}>
                    <IoMdAlarm /> Añadir NO disponibilidad
                </button>
            </div> */}
        </div>
    );
};

export default Disponibilidad;