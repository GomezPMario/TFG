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
    const [partidosFederados, setPartidosFederados] = useState([]); // Partidos del mes activo

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    useEffect(() => {
        const fetchMeses = async (id) => {
            try {
                const response = await axios.get(`${baseURL}/partidos/${id}`);
                const partidos = response.data;

                const mesesUnicos = Array.from(
                    new Set(
                        partidos.map((partido) => {
                            const fecha = new Date(partido.dia.split('/').reverse().join('-'));
                            const opciones = { year: 'numeric', month: 'long' };
                            let mes = fecha.toLocaleDateString('es-ES', opciones);
                            mes = mes.replace(' de ', ' ');
                            mes = capitalize(mes);
                            return { mes, fecha };
                        })
                    )
                );

                mesesUnicos.sort((a, b) => b.fecha - a.fecha);
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
            return;
        }

        setMesActivo(mes); // Abre el nuevo mes

        try {
            const [mesNombre, year] = mes.split(' ');
            const response = await axios.get(
                `${baseURL}/api/partidos/federados/${arbitroId}/${mesNombre}/${year}`
            );
            setPartidosFederados(response.data);
        } catch (error) {
            console.error('Error al filtrar los partidos federados:', error);
        }
    };


    return (
        <div className="nominas-container">
            <h1 className="nominas-title">Comprobación de Nóminas</h1>

            {meses.length > 0 ? (
                meses.map((item, index) => (
                    <div
                        key={index}
                        className={`mes-container ${mesActivo === item.mes ? 'activo' : ''}`}
                        onClick={() => toggleMesActivo(item.mes)}
                    >
                        <h2>{item.mes}</h2>
                        <div className="icono-check">
                            {mesActivo === item.mes ? <RxCross2 /> : <RiArrowDropDownLine />}
                        </div>
                        {mesActivo === item.mes && (
                            <div className="nominas-detalle">
                                {partidosFederados.length > 0 ? (
                                    <table className="tabla-nominas">
                                        <thead>
                                            <tr>
                                                <th colSpan="9" className="tabla-titulo">Categorías Federadas</th>
                                            </tr>
                                            <tr>
                                                <th>Día</th>
                                                <th>Hora</th>
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
                                            {partidosFederados.map((partido, idx) => {
                                                // Asegurarse de que todos los valores sean números o 0
                                                const importe = parseFloat(partido.importe) || 0;
                                                const dietas = parseFloat(partido.dietas) || 0;
                                                const desplazamiento = parseFloat(partido.desplazamiento) || 0;

                                                // Valor específico cuando dieta es 1
                                                const dietaValor = 10; // Cambia este valor según sea necesario

                                                // Formatear dietas y desplazamiento
                                                const dietaFormatted = dietas === 0
                                                    ? '--'
                                                    : dietas === 1
                                                        ? dietaValor.toFixed(2) // Muestra el valor definido si dieta es 1
                                                        : dietas.toFixed(2);
                                                const desplazamientoFormatted = desplazamiento === 0 ? '--' : desplazamiento.toFixed(2);

                                                // Calcular el total
                                                const total = importe + (dietas === 1 ? dietaValor : dietas) + desplazamiento;

                                                return (
                                                    <tr key={idx}>
                                                        <td>{formatDia(partido.dia)}</td>
                                                        <td>{formatHora(partido.hora)}</td>
                                                        <td>{partido.categoria}</td>
                                                        <td>{partido.equipoA}</td>
                                                        <td>{partido.equipoB}</td>
                                                        <td>{importe.toFixed(2)}</td>
                                                        <td>{desplazamientoFormatted}</td>
                                                        <td>{dietaFormatted}</td>
                                                        <td>{total.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay partidos federados para este mes.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay nóminas disponibles.</p>
            )}
        </div>
    );
};

export default Nominas;
