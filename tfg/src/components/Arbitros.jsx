import React, { useState, useEffect } from 'react';
import './styles/Arbitros.css';
import { baseURL } from './Login';
import NuevoArbitro from './NuevoArbitro';
import Licencias from './Licencias';

const Arbitros = () => {
    const [arbitros, setArbitros] = useState([]);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [orderType, setOrderType] = useState('asc');
    const [permission, setPermission] = useState('');
    const [showNuevoArbitro, setShowNuevoArbitro] = useState(false);
    const [showLicencias, setShowLicencias] = useState(false);

    useEffect(() => {
        const fetchArbitros = async () => {
            try {
                const response = await fetch(`${baseURL}/arbitros?orderBy=${orderBy || 'numero_colegiado'}&orderType=${orderBy ? orderType : 'asc'}&search=${search}&permission=${permission}`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                setArbitros(data);
            } catch (error) {
                console.error('Error fetching arbitros:', error);
            }
        };

        fetchArbitros();
    }, [orderBy, orderType, search, permission]);

    const handleOrderByChange = (value) => {
        setOrderBy(value);
        setOrderType('asc');
        if (value !== 'permiso') {
            setPermission('');
        }
        if (value !== 'tipo_cargo') {
            setSearch('');
        }
    };

    return (
        <div className="container">
            <h1 className="title">Listado de Árbitros-Oficiales</h1>
            <button className="button" onClick={() => setShowLicencias(true)}>Gestionar licencias</button>
            <button className="button" onClick={() => setShowNuevoArbitro(true)}>Añadir nuevo árbitro</button>
            <button className="button" onClick={() => setShowNuevoArbitro(true)}>Exportar datos</button>
            
            {showLicencias && (
                <Licencias onClose={() => setShowLicencias(false)} />
            )}

            {showNuevoArbitro && (
                // <NuevoArbitro onClose={() => setShowNuevoArbitro(false)} />
                <NuevoArbitro
                    onClose={() => setShowNuevoArbitro(false)}
                    isManual={true}  // Aquí estamos indicando que el registro es manual
                />
            )}

            {!showNuevoArbitro && (
                <>
                    <div className="filter-search-container">
                        <div className="filter-container">
                            <select onChange={e => handleOrderByChange(e.target.value)} value={orderBy}>
                                <option value="">Ordenar por</option>
                                <option value="numero_colegiado">Número Colegiado</option>
                                <option value="tipo_cargo">Cargo</option>
                                <option value="categoria">Categoría</option>
                                <option value="permiso">Permiso</option>
                            </select>

                            {orderBy === 'numero_colegiado' && (
                                <select onChange={e => setOrderType(e.target.value)} value={orderType}>
                                    <option value="asc">Ascendente</option>
                                    <option value="desc">Descendente</option>
                                </select>
                            )}

                            {orderBy === 'tipo_cargo' && (
                                <select onChange={e => setOrderType(e.target.value)} value={orderType}>
                                    <option value="">Selecciona cargo</option>
                                    <option value="arbitro">Árbitro</option>
                                    <option value="oficial">Oficial</option>
                                </select>
                            )}

                            {orderBy === 'categoria' && (
                                <select onChange={e => setOrderType(e.target.value)} value={orderType}>
                                    <option value="asc">Ascendente</option>
                                    <option value="desc">Descendente</option>
                                </select>
                            )}

                            {orderBy === 'permiso' && (
                                <select onChange={e => setPermission(e.target.value)} value={permission}>
                                    <option value="">Seleccionar permiso</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Técnico</option>
                                    <option value="3">Árbitro - Oficial</option>
                                </select>
                            )}
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
                                <th>Número Colegiado</th>
                                <th>Alias</th>
                                <th>Nombre Completo</th>
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
                </>
            )}
        </div>
    );
};

export default Arbitros;
