import React, { useState } from 'react';
import './styles/Exportar.css';

const Exportar = ({ onClose }) => {
    const fields = [
        { label: 'Usuario', value: 'username' },
        { label: 'Contraseña', value: 'password' },
        { label: 'Nombre', value: 'nombre' },
        { label: 'Apellidos', value: 'apellido' },
        { label: 'Domicilio', value: 'domicilio' },
        { label: 'Teléfono', value: 'telefono' },
        { label: 'Email', value: 'email' },
        { label: 'Cuenta Bancaria', value: 'cuenta' },
        { label: 'Alias', value: 'alias' },
        { label: 'Número de Colegiado', value: 'numero_colegiado' },
        { label: 'Permiso', value: 'permiso' },
        { label: 'Cargo', value: 'cargo' },
        { label: 'Categoría', value: 'categoria' },
        { label: 'Nivel', value: 'nivel' },
        { label: 'Vehículo', value: 'vehiculo' },
        { label: 'Fecha de Nacimiento', value: 'fecha_nacimiento' }
    ];

    const [selectedFields, setSelectedFields] = useState([]);

    // Manejar la selección de checkboxes
    const handleCheckboxChange = (fieldValue) => {
        setSelectedFields((prevSelectedFields) =>
            prevSelectedFields.includes(fieldValue)
                ? prevSelectedFields.filter((f) => f !== fieldValue)
                : [...prevSelectedFields, fieldValue]
        );
    };

    // Manejar la exportación de datos seleccionados a XML
    const handleExportXML = async () => {

    };


    return (
        <div className="exportar-modal" onClick={(e) => e.target.classList.contains('exportar-modal') && onClose()}>
            <div className="exportar-content">
                <h2>Exportar Datos</h2>
                <div className="exportar-checkboxes">
                    {fields.map(({ label, value }) => (
                        <label key={value} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(value)}
                                onChange={() => handleCheckboxChange(value)}
                            />
                            {label}
                        </label>
                    ))}
                </div>
                <div className="exportar-buttons">
                    <button className="button-exportar" onClick={handleExportXML}>Exportar a XML</button>
                </div>
            </div>
        </div>
    );
};

export default Exportar;
