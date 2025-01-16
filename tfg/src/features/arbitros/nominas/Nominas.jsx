import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../../components/login/Login';
import './Nominas.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

// Función para formatear el día en formato dd/mm/yyyy
const formatDia = (dia) => {
    const date = new Date(dia);
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en base 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Función para formatear la hora en formato hh:mm
const formatHora = (hora) => {
    const [hours, minutes] = hora.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const Nominas = ({ arbitroId }) => {
    const [meses, setMeses] = useState([]);
    const [mesActivo, setMesActivo] = useState(null); // Mes actualmente desplegado
    const [partidosFederados, setPartidosFederados] = useState([]); // Partidos federados del mes activo
    const [partidosEscolares, setPartidosEscolares] = useState([]); // Partidos escolares del mes activo

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    useEffect(() => {
        const fetchMeses = async (id) => {
            try {
                const response = await axios.get(`${baseURL}/api/partidos/${id}`);
                const partidos = response.data;

                // Crear un mapa para evitar duplicados
                const mesesMap = new Map();

                partidos.forEach((partido) => {
                    const fecha = new Date(partido.dia.split('/').reverse().join('-'));
                    const opciones = { year: 'numeric', month: 'long' };
                    let mes = fecha.toLocaleDateString('es-ES', opciones);
                    mes = mes.replace(' de ', ' ');
                    mes = capitalize(mes);

                    // Usar el mes como clave única
                    if (!mesesMap.has(mes)) {
                        mesesMap.set(mes, { mes, fecha });
                    }
                });

                // Convertir el mapa a un array ordenado por fecha
                const mesesUnicos = Array.from(mesesMap.values()).sort((a, b) => b.fecha - a.fecha);
                setMeses(mesesUnicos);
            } catch (error) {
                console.error('Error al obtener los partidos:', error);
            }
        };

        if (arbitroId) {
            fetchMeses(arbitroId);
        }
    }, [arbitroId]);


    const toggleMesActivo = async (mes) => {
        if (mesActivo === mes) {
            setMesActivo(null); // Cierra el mes si ya está abierto
            setPartidosFederados([]);
            setPartidosEscolares([]);
            return;
        }

        setMesActivo(mes); // Abre el nuevo mes

        try {
            const [mesNombre, year] = mes.split(' ');

            // Fetch partidos federados
            const federadosResponse = await axios.get(
                `${baseURL}/api/partidos/federados/${arbitroId}/${mesNombre}/${year}`
            );
            setPartidosFederados(federadosResponse.data);

            // Fetch partidos escolares
            const escolaresResponse = await axios.get(
                `${baseURL}/api/partidos/escolares/${arbitroId}/${mesNombre}/${year}`
            );
            setPartidosEscolares(escolaresResponse.data);
        } catch (error) {
            console.error('Error al filtrar los partidos:', error);
        }
    };

    // const renderTabla = (partidos, titulo) => (
    //     <table className="tabla-nominas">
    //         <thead>
    //             <tr>
    //                 <th colSpan="10" className="tabla-titulo">{titulo}</th>
    //             </tr>
    //             <tr>
    //                 <th>Día</th>
    //                 <th>Hora</th>
    //                 <th>Función</th>
    //                 <th>Categoría</th>
    //                 <th>Equipo A</th>
    //                 <th>Equipo B</th>
    //                 <th>Importe</th>
    //                 <th>Desplazamiento</th>
    //                 <th>Dietas</th>
    //                 <th>Total</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {partidos.map((partido, idx) => {
    //                 const importe = parseFloat(partido.importe) || 0;
    //                 const dietas = parseFloat(partido.dietas) || 0;
    //                 const desplazamiento = parseFloat(partido.desplazamiento) || 0;

    //             const dietaFormatted = dietas === 0 ? '--' : `${dietas.toFixed(2)} €`;
    //             const desplazamientoFormatted = desplazamiento === 0 ? '--' : `${desplazamiento.toFixed(2)} €`;
    //             const total = importe + dietas + desplazamiento;

    //             return (
    //             <tr key={idx}>
    //                 <td>{formatDia(partido.dia)}</td>
    //                 <td>{formatHora(partido.hora)}</td>
    //                 <td>{partido.funcion}</td>
    //                 <td>{partido.categoria}</td>
    //                 <td>{partido.equipoA}</td>
    //                 <td>{partido.equipoB}</td>
    //                 <td>{importe.toFixed(2)} €</td>
    //                 <td>{desplazamientoFormatted}</td>
    //                 <td>{dietaFormatted}</td>
    //                 <td>{total.toFixed(2)}</td>
    //             </tr>
    //             );
    //             })}
    //         </tbody>
    //         <tfoot>
    //             <tr>
    //                 <td colSpan="6" className="tabla-footer texto-derecha">
    //                     <span className="texto-a-cobrar">A cobrar:</span>
    //                 </td>
    //                 <td>
    //                     {partidos.reduce((sum, partido) => {
    //                         const importe = parseFloat(partido.importe) || 0;
    //                         return sum + importe;
    //                     }, 0).toFixed(2)} €
    //                 </td>
    //                 <td>
    //                     {partidos.reduce((sum, partido) => {
    //                         const desplazamiento = parseFloat(partido.desplazamiento) || 0;
    //                         return sum + desplazamiento;
    //                     }, 0).toFixed(2)} €
    //                 </td>
    //                 <td>
    //                     {partidos.reduce((sum, partido) => {
    //                         const dietas = parseFloat(partido.dietas) || 0;
    //                         return sum + dietas;
    //                     }, 0).toFixed(2)} €
    //                 </td>
    //                 <td className="tabla-total">
    //                     {partidos.reduce((sum, partido) => {
    //                         const importe = parseFloat(partido.importe) || 0;
    //                         const desplazamiento = parseFloat(partido.desplazamiento) || 0;
    //                         const dietas = parseFloat(partido.dietas) || 0;
    //                         return sum + importe + desplazamiento + dietas;
    //                     }, 0).toFixed(2)} €
    //                 </td>
    //             </tr>
    //         </tfoot>
    //     </table>
    // );

    const renderTabla = (partidos, titulo) => (
        <table className="tabla-nominas">
            <thead>
                <tr>
                    <th colSpan="10" className="tabla-titulo">{titulo}</th>
                </tr>
                <tr>
                    <th>Día</th>
                    <th>Hora</th>
                    <th>Función</th>
                    <th>Categoría</th>
                    <th>Equipo A</th>
                    <th>Equipo B</th>
                    <th>Importe</th>
                    <th>Desplazamiento</th>
                    <th>Dietas</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {partidos.map((partido, idx) => {
                    const importe = parseFloat(partido.importe) || 0;
                    const dietas = parseFloat(partido.dietas) || 0;
                    const desplazamiento = parseFloat(partido.desplazamiento) || 0;

                    // Formatear las dietas
                    const dietaFormatted = dietas === 0 ? '--' : `${dietas.toFixed(2)} €`;
                    const desplazamientoFormatted = desplazamiento === 0 ? '--' : `${desplazamiento.toFixed(2)} €`;
                    const total = importe + dietas + desplazamiento;

                    return (
                        <tr key={idx}>
                            <td>{formatDia(partido.dia)}</td>
                            <td>{formatHora(partido.hora)}</td>
                            <td>{partido.funcion}</td>
                            <td>{partido.categoria}</td>
                            <td>{partido.equipoA}</td>
                            <td>{partido.equipoB}</td>
                            <td>{importe.toFixed(2)} €</td>
                            <td>{desplazamientoFormatted}</td>
                            <td>{dietaFormatted}</td>
                            <td>{total.toFixed(2)} €</td>
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="6" className="tabla-footer texto-derecha">
                        <span className="texto-a-cobrar">A cobrar:</span>
                    </td>
                    <td>
                        {partidos.reduce((sum, partido) => sum + (parseFloat(partido.importe) || 0), 0).toFixed(2)} €
                    </td>
                    <td>
                        {partidos.reduce((sum, partido) => sum + (parseFloat(partido.desplazamiento) || 0), 0).toFixed(2)} €
                    </td>
                    <td>
                        {partidos.reduce((sum, partido) => sum + (parseFloat(partido.dietas) || 0), 0).toFixed(2)} €
                    </td>
                    <td className="tabla-total">
                        {partidos.reduce((sum, partido) => {
                            const importe = parseFloat(partido.importe) || 0;
                            const dietas = parseFloat(partido.dietas) || 0;
                            const desplazamiento = parseFloat(partido.desplazamiento) || 0;
                            return sum + importe + dietas + desplazamiento;
                        }, 0).toFixed(2)} €
                    </td>
                </tr>
            </tfoot>
        </table>
    );


    return (
        <div className="nominas-container">
            <h1 className="nominas-title">Comprobación de Nóminas</h1>
            <p style={{ fontStyle: 'italic', fontSize: '0.7em' }}>Si encuentras algún error, por favor envía un correo a Luis.</p>

            {meses.length > 0 ? (
                meses.map((item, index) => (
                    <div
                        key={index}
                        className={`mes-container ${mesActivo === item.mes ? 'activo' : ''}`}
            onClick={() => toggleMesActivo(item.mes)}
                    >
            <div className="mes-header">
                <h2>{item.mes}</h2>
                <div className="icono-check">
                    {mesActivo === item.mes ? <RxCross2 /> : <RiArrowDropDownLine />}
                </div>
            </div>
            {mesActivo === item.mes && (
                <div className="nominas-detalle">
                    {renderTabla(partidosEscolares, 'Categorías Escolares')}
                    {renderTabla(partidosFederados, 'Categorías Federadas')}
                </div>
            )}
        </div>

    ))
            ) : (
    <p>No hay nóminas disponibles.</p>
)}
        </div >
    );
};

export default Nominas;