import React, { useState } from 'react';
import { IoCreateOutline } from "react-icons/io5";
import { CgImport } from "react-icons/cg";
import './styles/Partidos.css';

const Partidos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);

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

    return (
        <div className="partidos-container">
            <h1 className="partidos-title">Listado de Partidos</h1>

            <button className="button">
                <IoCreateOutline style={{ marginRight: '8px' }} />
                Crear Partido
            </button>
            <button className="button" onClick={openModal}>
                <CgImport style={{ marginRight: '8px' }} />
                Importar Partidos
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
        </div>
    );
};

export default Partidos;
