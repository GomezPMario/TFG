import React, { useEffect, useState } from 'react';
import './Campos.css';
import { MdGroupAdd } from 'react-icons/md';
import { baseURL} from '../../../components/login/Login'

const Campos = () => {
    const [campos, setCampos] = useState([]);

    // Obtener los campos desde el backend
    useEffect(() => {
        fetch(`${baseURL}/api/campos`) // Cambia el puerto si es necesario
            .then(response => response.json())
            .then(data => setCampos(data))
            .catch(error => console.error('Error fetching campos:', error));
    }, []);

    return (
        <div className="container">
            <h1 className="title">Listado de Campos</h1>

            <button className="button">
                <MdGroupAdd style={{ marginRight: '8px' }} />
                Crear Campo
            </button>

            <table className="campos-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Calle</th>
                        <th className="celda-ubicacion">Ubicación</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map(campo => (
                        <tr key={campo.id}>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>{campo.nombre}</td>
                            <td>{campo.calle}</td>
                            <td className='celda-ubicacion'>
                                <a href={campo.ubicacion} target="_blank" rel="noopener noreferrer">
                                    Ver en Google Maps
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Campos;
