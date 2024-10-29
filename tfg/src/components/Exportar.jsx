// Exportar.jsx
import React, { useState } from 'react';
import './styles/Exportar.css';

const Exportar = ({ onClose }) => {
    const fields = [
        'Usuario', 'Contraseña', 'Nombre', 'Apellidos', 'Domicilio',
        'Teléfono', 'Email', 'Cuenta Bancaria', 'Alias', 'Número de Colegiado', 'Permiso',
        'Cargo', 'Categoría', 'Nivel', 'Vehículo', 'Fecha de Nacimiento'
    ];

    const [selectedFields, setSelectedFields] = useState([]);

    const handleCheckboxChange = (field) => {
        setSelectedFields((prevSelectedFields) =>
            prevSelectedFields.includes(field)
                ? prevSelectedFields.filter((f) => f !== field)
                : [...prevSelectedFields, field]
        );
    };

    const handleExport = () => {
        if (selectedFields.length === 0) {
            alert('Por favor, selecciona al menos un campo para exportar.');
            return;
        }

        console.log('Exportando los campos seleccionados:', selectedFields);
        onClose();
    };

    return (
        <div className="exportar-modal">
            <div className="exportar-content">
                <h2>Exportar Datos</h2>
                <div className="exportar-checkboxes">
                    {fields.map((field) => (
                        <label key={field} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => handleCheckboxChange(field)}
                            />
                            {field}
                        </label>
                    ))}
                </div>
                <div className="exportar-buttons">
                    <button className="button-exportar" onClick={handleExport}>Exportar</button>
                    <button className="button-close" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default Exportar;
