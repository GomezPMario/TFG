import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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

    const handleExportXLSX = async () => {
        try {
            const response = await fetch('http://localhost:5000/arbitros/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields: selectedFields }),
            });

            if (response.ok) {
                const data = await response.json();
                exportToXLSX(data);
            } else {
                console.error('Error en la exportación');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para convertir JSON a XLSX con estilos y descargarlo
    const exportToXLSX = async (data) => {
        if (data.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos Exportados');

        const permisoMap = { 1: 'Admin', 2: 'Técnico', 3: 'Árbitro-Oficial' };
        const cargoMap = { 1: 'Árbitro', 2: 'Oficial' };
        const vehiculoMap = { 0: 'Ninguno', 1: 'Coche', 2: 'Moto', 3: 'Ambos' };

        const headerRow = worksheet.addRow(selectedFields.map(field => {
            const fieldObj = fields.find(f => f.value === field);
            return fieldObj ? fieldObj.label : field;
        }));

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FF000000' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF96C5' }
            };
        });

        data.forEach(row => {
            const rowData = selectedFields.map(field => {
                if (field === 'permiso') {
                    return permisoMap[row[field]] || row[field];
                } else if (field === 'cargo') {
                    return cargoMap[row[field]] || row[field];
                } else if (field === 'vehiculo') {
                    return vehiculoMap[row[field]] || row[field];
                } else if (field === 'fecha_nacimiento') {
                    const originalDate = new Date(row[field]);
                    const modifiedDate = new Date(originalDate.getTime() + 24 * 60 * 60 * 1000); // Sumar un día
                    return modifiedDate;
                }
                return row[field] || '';
            });

            const newRow = worksheet.addRow(rowData);

            // Aplicar formato de fecha solo a la columna de "Fecha de Nacimiento"
            if (selectedFields.includes('fecha_nacimiento')) {
                const dateColumnIndex = selectedFields.indexOf('fecha_nacimiento') + 1;
                newRow.getCell(dateColumnIndex).numFmt = 'dd/mm/yyyy';
            }
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellLength = cell.value ? cell.value.toString().length : 10;
                if (cellLength > maxLength) {
                    maxLength = cellLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'exported_data.xlsx');
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
                    <button className="button-exportar" onClick={handleExportXLSX}>Exportar a XLSX</button>
                </div>
            </div>
        </div>
    );
};

export default Exportar;
