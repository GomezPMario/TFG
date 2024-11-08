import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { baseURL } from './Login';
import logo from '../components/images/LogoCAAB.png';

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [showAuxiliar2InPDF, setShowAuxiliar2InPDF] = useState(false); // Estado para controlar la visibilidad de Auxiliar 2 en PDF
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const season = currentMonth >= 8 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;
    const contentRef = useRef();

    // Obtener las tarifas de la API
    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/tarifas`);
                setTarifas(response.data);

                // Verificar si algún elemento tiene valor en Auxiliar_2 para mostrarlo en el PDF
                const hasAuxiliar2 = response.data.some((tarifa) => tarifa.Auxiliar_2 !== null);
                setShowAuxiliar2InPDF(hasAuxiliar2);
            } catch (error) {
                console.error('Error al obtener tarifas:', error);
            }
        };

        fetchTarifas();
    }, []);

    // Convertir imagen a base64 usando un objeto Image
    const loadImageAsBase64 = (src, callback) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        };
    };

    // Función para descargar el PDF
    const downloadPDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(12);
        const title = `TARIFAS ARBITRAJES - TEMPORADA ${season}`;
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;

        // Definir el encabezado según la visibilidad de Auxiliar 2 en PDF
        const head = showAuxiliar2InPDF
            ? [['Categoría', 'Principal', 'Auxiliar 1', 'Auxiliar 2', 'Anotador', 'Crono', '24"', 'Ayud. Anot.', 'Canon FAB', 'Total']]
            : [['Categoría', 'Principal', 'Auxiliar 1', 'Anotador', 'Crono', '24"', 'Ayud. Anot.', 'Canon FAB', 'Total']];

        // Cargar la imagen y luego generar el PDF
        loadImageAsBase64(logo, (base64Image) => {
            doc.addImage(base64Image, 'PNG', 10, 5, 30, 15, '', 'FAST');
            doc.setTextColor(0, 0, 0);
            doc.text(title, titleX, 15);

            // Configuración de la tabla con estilos personalizados
            doc.autoTable({
                startY: 23,
                head: head,
                body: tarifas.map((tarifa) => {
                    const row = [
                        tarifa.categoria,
                        tarifa.Principal ? `${Number(tarifa.Principal).toFixed(2)} €` : '',
                        tarifa.Auxiliar_1 ? `${Number(tarifa.Auxiliar_1).toFixed(2)} €` : '',
                    ];

                    // Agregar Auxiliar 2 solo si showAuxiliar2InPDF es true
                    if (showAuxiliar2InPDF) {
                        row.push(tarifa.Auxiliar_2 ? `${Number(tarifa.Auxiliar_2).toFixed(2)} €` : '');
                    }

                    row.push(
                        tarifa.Anotador ? `${Number(tarifa.Anotador).toFixed(2)} €` : '',
                        tarifa.Cronometrador ? `${Number(tarifa.Cronometrador).toFixed(2)} €` : '',
                        tarifa.Veinticuatro_Segundos ? `${Number(tarifa.Veinticuatro_Segundos).toFixed(2)} €` : '',
                        tarifa.Ayudante_Anotador ? `${Number(tarifa.Ayudante_Anotador).toFixed(2)} €` : '',
                        tarifa.Canon_FAB ? `${Number(tarifa.Canon_FAB).toFixed(2)} €` : '',
                        `${Number(tarifa.Total).toFixed(2)} €`
                    );

                    return row;
                }),
                styles: {
                    fontSize: 7,
                    cellPadding: 0.8,
                    overflow: 'linebreak',
                    halign: 'center',
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    halign: 'center',
                    textColor: [255, 255, 255],
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0]
                },
                columnStyles: {
                    0: { cellWidth: 'auto', halign: 'left', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    1: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    2: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    ...(showAuxiliar2InPDF && { 3: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] } }),
                    [showAuxiliar2InPDF ? 4 : 3]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    [showAuxiliar2InPDF ? 5 : 4]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    [showAuxiliar2InPDF ? 6 : 5]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    [showAuxiliar2InPDF ? 7 : 6]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    [showAuxiliar2InPDF ? 8 : 7]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                    [showAuxiliar2InPDF ? 9 : 8]: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] },
                },
                margin: { top: 20, left: 10, right: 10 },
                tableWidth: 'auto',
                rowHeight: 6,
            });

            doc.save(`Tarifas_Arbitrajes_${season}.pdf`);
        });
    };

    return (
        <div className="tarifas-container" ref={contentRef}>
            <h1 className="title">Tarifas Arbitrajes - Temporada {season}</h1>

            <table>
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Principal</th>
                        <th>Auxiliar 1</th>
                        <th>Auxiliar 2</th>
                        <th>Anotador</th>
                        <th>Cronometrador</th>
                        <th>24 segundos</th>
                        <th>Ayudante de Anotador</th>
                        <th>Canon FAB</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {tarifas.map((tarifa) => (
                        <tr key={tarifa.categoria}>
                            <td>{tarifa.categoria}</td>
                            <td>{tarifa.Principal ? `${Number(tarifa.Principal).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Auxiliar_1 ? `${Number(tarifa.Auxiliar_1).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Auxiliar_2 ? `${Number(tarifa.Auxiliar_2).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Anotador ? `${Number(tarifa.Anotador).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Cronometrador ? `${Number(tarifa.Cronometrador).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Veinticuatro_Segundos ? `${Number(tarifa.Veinticuatro_Segundos).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Ayudante_Anotador ? `${Number(tarifa.Ayudante_Anotador).toFixed(2)} €` : ''}</td>
                            <td>{tarifa.Canon_FAB ? `${Number(tarifa.Canon_FAB).toFixed(2)} €` : ''}</td>
                            <td>{Number(tarifa.Total).toFixed(2)} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={downloadPDF}>Descargar PDF</button>
        </div>
    );
};

export default Tarifas;
