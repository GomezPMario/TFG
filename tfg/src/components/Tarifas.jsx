import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { baseURL } from './Login';
import logo from '../components/images/LogoCAAB.png';

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
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
            } catch (error) {
                console.error('Error al obtener tarifas:', error);
            }
        };

        fetchTarifas();
    }, []);

    // Convertir imagen a base64 usando un objeto Image
    const loadImageAsBase64 = (src, callback) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Para evitar problemas de CORS
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
        doc.setFontSize(12); // Tamaño de fuente reducido para el título
        const title = `TARIFAS ARBITRAJES - TEMPORADA ${season}`;
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;

        // Cargar la imagen y luego generar el PDF
        loadImageAsBase64(logo, (base64Image) => {
            // Añadir la imagen de fondo en una capa inferior con opacidad reducida
            doc.addImage(base64Image, 'PNG', 10, 5, 30, 15, '', 'FAST');

            // Añadir el título en la capa superior
            doc.setTextColor(0, 0, 0); // Restaurar color negro para el texto
            doc.text(title, titleX, 15); // Ajusta el espacio para el título

            // Configuración de la tabla con estilos personalizados
            doc.autoTable({
                startY: 23, // Reducir espacio entre título y tabla
                head: [['Categoría', 'Principal', 'Auxiliar 1', 'Anotador', 'Crono', '24"', 'Ayud. Anot.', 'Canon FAB', 'Total']],
                body: tarifas.map((tarifa) => [
                    tarifa.categoria,
                    tarifa.Principal ? `${Number(tarifa.Principal).toFixed(2)} €` : '',
                    tarifa.Auxiliar_1 ? `${Number(tarifa.Auxiliar_1).toFixed(2)} €` : '',
                    tarifa.Anotador ? `${Number(tarifa.Anotador).toFixed(2)} €` : '',
                    tarifa.Cronometrador ? `${Number(tarifa.Cronometrador).toFixed(2)} €` : '',
                    tarifa.Veinticuatro_Segundos ? `${Number(tarifa.Veinticuatro_Segundos).toFixed(2)} €` : '',
                    tarifa.Ayudante_Anotador ? `${Number(tarifa.Ayudante_Anotador).toFixed(2)} €` : '',
                    tarifa.Canon_FAB ? `${Number(tarifa.Canon_FAB).toFixed(2)} €` : '',
                    `${Number(tarifa.Total).toFixed(2)} €`
                ]),
                styles: {
                    fontSize: 7, // Reducir tamaño de fuente para la tabla
                    cellPadding: 0.8, // Reducir el padding de las celdas al mínimo
                    overflow: 'linebreak', // Ajuste de texto dentro de las celdas
                    halign: 'center', // Centrar el contenido por defecto
                    textColor: [0, 0, 0], // Poner el texto del contenido en negro
                },
                headStyles: {
                    halign: 'center', // Centrar el texto de la cabecera
                    textColor: [255, 255, 255], // Texto blanco en el encabezado
                    lineWidth: 0.1, // Grosor de la línea del borde
                    lineColor: [0, 0, 0] // Color negro para el borde del encabezado
                },
                columnStyles: {
                    0: { cellWidth: 'auto', halign: 'left', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Categoría, alineada a la izquierda
                    1: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Principal
                    2: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Auxiliar 1
                    3: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Anotador
                    4: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Crono
                    5: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // 24 segundos
                    6: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Ayud. Anot.
                    7: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Canon FAB
                    8: { cellWidth: 'auto', lineWidth: 0.1, lineColor: [0, 0, 0] }, // Total
                },
                margin: { top: 20, left: 10, right: 10 }, // Márgenes reducidos
                tableWidth: 'auto', // Ajustar el ancho de la tabla al contenido
                rowHeight: 6, // Reducir la altura de las filas para optimizar el espacio vertical
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
