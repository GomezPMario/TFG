import React, { useState } from 'react';
import { baseURL } from './Login';
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

    const handleCheckboxChange = (fieldValue) => {
        setSelectedFields((prevSelectedFields) =>
            prevSelectedFields.includes(fieldValue)
                ? prevSelectedFields.filter((f) => f !== fieldValue)
                : [...prevSelectedFields, fieldValue]
        );
    };

    const handleExport = async () => {
        try {
            const response = await fetch(`${baseURL}/arbitros/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields: selectedFields }),
            });

            if (response.ok) {
                const data = await response.json();
                exportToCSV(data); // Llama a la función de exportación CSV
            } else {
                console.error('Error en la exportación');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para convertir JSON a CSV y descargarlo
    const exportToCSV = (data) => {
        if (data.length === 0) return;

        // Mapeo de los valores a sus labels para el encabezado
        const headers = selectedFields.map(field => {
            const fieldObj = fields.find(f => f.value === field);
            return fieldObj ? fieldObj.label : field;
        }).join(',');

        // Crear las filas usando los valores correspondientes a cada campo
        const rows = data.map(row =>
            selectedFields.map(field => row[field] || '').join(',')
        );

        // Crear el contenido CSV uniendo los encabezados y las filas
        const csvContent = [headers, ...rows].join('\n');

        // Añadir BOM al principio para UTF-8
        const bom = "\uFEFF";
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exported_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <button className="button-exportar" onClick={handleExport}>Exportar a CSV</button>
                </div>
            </div>
        </div>
    );
};

export default Exportar;
