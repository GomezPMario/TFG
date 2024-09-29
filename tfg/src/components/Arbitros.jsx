import React, { useState, useEffect } from 'react';
import './styles/Arbitros.css';
import { baseURL } from './Login';


const Arbitros = () => {
    const [arbitros, setArbitros] = useState([]);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState('');

    // Función para obtener todos los árbitros de la base de datos
    useEffect(() => {
        const fetchArbitros = async () => {
            try {
                const response = await fetch(`${baseURL}/arbitros?orderBy=${orderBy}&search=${search}`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                console.log('Datos recibidos:', data); // Verifica los datos en la consola del navegador
                setArbitros(data);
            } catch (error) {
                console.error('Error fetching arbitros:', error);
            }
        };

        fetchArbitros();
    }, [orderBy, search]); // Llama a la API cuando cambien los filtros


    return (
        <div className="container">
            <h1 className="title">Listado de Árbitros-Oficiales</h1>
            <button className="button" onClick={() => console.log('Añadir nuevo árbitro')}>Añadir nuevo árbitro</button>

            {/* Contenedor de filtro y búsqueda */}
            <div className="filter-search-container">
                <div className="filter-container">
                    <label>Order by:</label>
                    <select onChange={e => setOrderBy(e.target.value)} value={orderBy}>
                        <option value="">Seleccionar</option>
                        <option value="numero_colegiado">Número Colegiado</option>
                        <option value="tipo_cargo">Tipo de Cargo</option>
                        <option value="categoria">Categoría</option>
                        <option value="permiso">Permiso</option>
                    </select>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, usuario, etc."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th id="col-num">Número Colegiado</th>
                        <th id="col-alias">Alias</th>
                        <th id="col-name">Nombre Completo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {arbitros.map(arbitro => (
                        <tr key={arbitro.id}>
                            <td>{arbitro.numero_colegiado}</td>
                            <td>{arbitro.alias}</td>
                            <td>{arbitro.nombre} {arbitro.apellido}</td>
                            <td><button>Ver árbitro</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



export default Arbitros;