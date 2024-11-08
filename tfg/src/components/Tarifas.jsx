import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { baseURL } from './Login';
import logo from '../components/images/LogoCAAB.png';
import './styles/Tarifas.css'; // Importa los estilos de Tarifas
import { FaDownload } from "react-icons/fa6";

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [showAuxiliar2InPDF, setShowAuxiliar2InPDF] = useState(false);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const season = currentMonth >= 8 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/tarifas`);
                setTarifas(response.data);
                const hasAuxiliar2 = response.data.some((tarifa) => tarifa.Auxiliar_2 !== null);
                setShowAuxiliar2InPDF(hasAuxiliar2);
            } catch (error) {
                console.error('Error al obtener tarifas:', error);
            }
        };

        fetchTarifas();
    }, []);

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

    const downloadPDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(12);
        const title = `TARIFAS ARBITRAJES - TEMPORADA ${season}`;
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
        const head = showAuxiliar2InPDF
            ? [['Categoría', 'Principal', 'Auxiliar 1', 'Auxiliar 2', 'Anotador', 'Crono', '24"', 'Ayud. Anot.', 'Canon FAB', 'Total']]
            : [['Categoría', 'Principal', 'Auxiliar 1', 'Anotador', 'Crono', '24"', 'Ayud. Anot.', 'Canon FAB', 'Total']];

        loadImageAsBase64(logo, (base64Image) => {
            doc.addImage(base64Image, 'PNG', 10, 5, 30, 15, '', 'FAST');
            doc.setTextColor(0, 0, 0);
            doc.text(title, titleX, 15);
            doc.autoTable({
                startY: 23,
                head: head,
                body: tarifas.map((tarifa) => {
                    const row = [
                        tarifa.categoria,
                        tarifa.Principal ? `${Number(tarifa.Principal).toFixed(2)} €` : '',
                        tarifa.Auxiliar_1 ? `${Number(tarifa.Auxiliar_1).toFixed(2)} €` : '',
                    ];
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
        <div className="tarifas-container">
            <h1 className="tarifas-title">Tarifas Arbitrajes - Temporada {season}</h1>

            <button className="button" onClick={downloadPDF}><FaDownload />Descargar PDF</button>

            <table className="tarifas-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Principal</th>
                        <th>Auxiliar 1</th>
                        <th>Auxiliar 2</th>
                        <th>Anotador</th>
                        <th>Cronometrador</th>
                        <th>24 segundos</th>
                        <th>Ayud. Anotador</th>
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

        </div>
    );
};

export default Tarifas;
