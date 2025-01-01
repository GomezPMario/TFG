import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import './Arbitros.css';
import { baseURL } from '../../../components/login/Login';
import NuevoArbitro from '../nuevoarbitro/NuevoArbitro';
import Licencias from '../licencias/Licencias';
import Exportar from '../exportar/Exportar';
import { MdManageHistory, MdGroupAdd } from 'react-icons/md';
import { PiShareBold } from 'react-icons/pi';
import { TiUserDelete } from "react-icons/ti";

const Arbitros = () => {
    const [arbitros, setArbitros] = useState([]);
    const [selectedArbitros, setSelectedArbitros] = useState([]); // Estado para captchas seleccionados
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [orderType, setOrderType] = useState('asc');
    const [permission, setPermission] = useState('');
    const [showNuevoArbitro, setShowNuevoArbitro] = useState(false);
    const [showLicencias, setShowLicencias] = useState(false);
    const [showExportar, setShowExportar] = useState(false);

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
        setPermission('');
        setSearch('');
    };

    const handleIconClick = async () => {
        if (selectedArbitros.length === 0) {
            alert("No se ha seleccionado ningún árbitro.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/arbitros`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedArbitros }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar los árbitros seleccionados');
            }

            alert('Árbitro(s) eliminados correctamente');
            setArbitros(arbitros.filter(arbitro => !selectedArbitros.includes(arbitro.id))); // Actualizar la lista en el frontend
            setSelectedArbitros([]); // Reiniciar selección
        } catch (error) {
            console.error('Error eliminando los árbitros:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedArbitros((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id) // Deseleccionar si ya estaba seleccionado
                : [...prev, id] // Agregar a seleccionados
        );
    };

    return (
        <div className="container">
            <h1 className="title">Listado de Árbitros-Oficiales</h1>

            <button className="button" onClick={() => setShowLicencias(true)}>
                <MdManageHistory style={{ marginRight: '8px' }} />
                Gestionar licencias
            </button>
            <button className="button" onClick={() => setShowNuevoArbitro(true)}>
                <MdGroupAdd style={{ marginRight: '8px' }} />
                Añadir nuevo árbitro
            </button>
            <button className="button" onClick={() => setShowExportar(true)}>
                <PiShareBold style={{ marginRight: '8px' }} />
                Exportar datos
            </button>

            {showLicencias && <Licencias onClose={() => setShowLicencias(false)} />}
            {showNuevoArbitro && <NuevoArbitro onClose={() => setShowNuevoArbitro(false)} isManual={true} />}
            {showExportar && <Exportar onClose={() => setShowExportar(false)} />}

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
                                placeholder="Buscar por nombre, alias, etc."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <TiUserDelete className="interactive-icon" onClick={handleIconClick} />
                                </th>
                                <th>Número Colegiado</th>
                                <th>Alias</th>
                                <th>Nombre Completo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arbitros.map(arbitro => (
                                <tr key={arbitro.id}>
                                    <td>
                                        <div className="captcha-container">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(arbitro.id)}
                                                checked={selectedArbitros.includes(arbitro.id)}
                                            />
                                        </div>
                                    </td>
                                    <td>{arbitro.numero_colegiado}</td>
                                    <td>{arbitro.alias}</td>
                                    <td>{arbitro.nombre} {arbitro.apellido}</td>
                                    <td>
                                        <Link to={`/arbitros/${arbitro.id}`}>
                                            <button>Ver árbitro</button>
                                        </Link>
                                    </td>
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