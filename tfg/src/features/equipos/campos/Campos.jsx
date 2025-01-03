import React, { useEffect, useState } from 'react';
import './Campos.css';
import { baseURL} from '../../../components/login/Login'
import { MdOutlineWhereToVote, MdBookmarkRemove } from "react-icons/md";

const Campos = () => {
    const [campos, setCampos] = useState([]);
    const [selectedCampos, setSelectedCampos] = useState([]);

    // Función para manejar la selección de campos
    const handleCheckboxChange = (id) => {
        setSelectedCampos((prevSelected) => {
            if (prevSelected.includes(id)) {
                // Si el campo ya está seleccionado, lo eliminamos de la lista
                return prevSelected.filter((campoId) => campoId !== id);
            } else {
                // Si el campo no está seleccionado, lo agregamos
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedCampos.length === 0) {
            alert('Selecciona al menos un campo para eliminar.');
            return;
        }

        fetch(`${baseURL}/api/campos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedCampos }), // Pasamos los IDs seleccionados
        })
            .then((response) => {
                if (response.ok) {
                    // Filtra los campos eliminados del estado
                    setCampos((prevCampos) =>
                        prevCampos.filter((campo) => !selectedCampos.includes(campo.id))
                    );
                    setSelectedCampos([]); // Resetea la selección
                } else {
                    alert('Error al eliminar los campos.');
                }
            })
            .catch((error) => {
                console.error('Error eliminando campos:', error);
            });
    };

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
                <MdOutlineWhereToVote style={{ marginRight: '8px' }} />
                Crear Campo
            </button>

            <table className="campos-table">
                <thead>
                    <tr>
                        <th>
                            <div className="captcha-container" onClick={handleDeleteSelected}>
                                <MdBookmarkRemove className="interactive-icon" />
                            </div>
                        </th>

                        <th>Nombre</th>
                        <th>Calle</th>
                        <th className="celda-ubicacion">Ubicación</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map(campo => (
                        <tr key={campo.id}>
                            <td>
                                <div className="captcha-container">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(campo.id)}
                                        checked={selectedCampos.includes(campo.id)}
                                    />
                                </div>
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
