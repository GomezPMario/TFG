import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../../components/login/Login';
import './Nominas.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

const Nominas = ({ arbitroId }) => {
    const [meses, setMeses] = useState([]);

    // Función para capitalizar la primera letra de un texto
    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    useEffect(() => {
        const fetchMeses = async (id) => {
            try {
                const response = await axios.get(`${baseURL}/partidos/${id}`);
                const partidos = response.data;

                // Extraer los meses únicos de los partidos
                const mesesUnicos = Array.from(
                    new Set(
                        partidos.map((partido) => {
                            const fecha = new Date(partido.dia.split('/').reverse().join('-'));
                            const opciones = { year: 'numeric', month: 'long' };
                            let mes = fecha.toLocaleDateString('es-ES', opciones);

                            // Eliminar " de " entre el mes y el año
                            mes = mes.replace(' de ', ' ');

                            // Capitalizar manualmente para asegurar la primera letra en mayúscula
                            mes = capitalize(mes);

                            return { mes, fecha }; // Devuelve un objeto con el mes formateado y la fecha para ordenarlo
                        })
                    )
                );

                // Ordenar los meses cronológicamente descendente (de más reciente a más antiguo)
                mesesUnicos.sort((a, b) => b.fecha - a.fecha);

                // Extraer solo los nombres de los meses después del ordenamiento
                const mesesFormateados = mesesUnicos.map((item) => item.mes);

                setMeses(mesesFormateados);
            } catch (error) {
                console.error('Error al obtener los partidos:', error);
            }
        };

        if (arbitroId) {
            fetchMeses(arbitroId); // Pasa arbitroId correctamente
        }
    }, [arbitroId]);

    return (
        <div className="nominas-container">
            <h1 className="nominas-title">Comprobación de Nóminas</h1>

            {meses.length > 0 ? (
                meses.map((mes, index) => (
                    <div key={index} className="mes-container">
                        <h2>{mes}</h2>
                        <div className="icono-check"><RiArrowDropDownLine /></div>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No hay nóminas disponibles.</p>
            )}
        </div>
    );
};

export default Nominas;
