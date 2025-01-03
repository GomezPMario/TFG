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
    const [category, setCategory] = useState('');
    const [permission, setPermission] = useState('');
    const [showNuevoArbitro, setShowNuevoArbitro] = useState(false);
    const [showLicencias, setShowLicencias] = useState(false);
    const [showExportar, setShowExportar] = useState(false);

    const categoryOptions = {
        arbitro: [
            "ACB - Escuela",
            "Escuela - ACB",
            "ACB",
            "1ª FEB",
            "2ª FEB",
            "3ª FEB",
            "A1",
            "A2",
            "A3",
            "A4",
            "P1",
            "P2",
            "P3",
            "Escuela",
        ],
        oficial: [
            "ACB - P3",
            "P3 - ACB",
            "ACB",
            "LF",
            "EBA",
            "1 DIV",
            "P1",
            "P2",
            "P3",
        ],
    };

    useEffect(() => {
        const fetchArbitros = async () => {
            try {
                const params = new URLSearchParams();

                if (orderBy) params.append('orderBy', orderBy);
                if (orderType) params.append('orderType', orderType); // Solo enviar si no está vacío
                if (permission && orderBy === 'permiso') params.append('permission', permission);
                if (category && orderBy === 'categoria') {
                    params.append('category', category);
                    params.append(
                        'categoryOrder',
                        category === 'Escuela - ACB' ? 'desc' : 'asc'
                    );
                }

                const response = await fetch(`${baseURL}/arbitros?${params.toString()}`);
                if (!response.ok) throw new Error('Error en la respuesta de la API');
                const data = await response.json();
                setArbitros(data);
            } catch (error) {
                console.error('Error fetching arbitros:', error);
            }
        };

        fetchArbitros();
    }, [orderBy, orderType, permission, category]);


    const handleOrderByChange = (value) => {
        setOrderBy(value);
        setOrderType('asc');
        setPermission('');
        setCategory('');
        setSearch('');
    };

    const handleOrderTypeChange = (value) => {
        if (orderBy === 'tipo_cargo' && value === '') {
            // Si el usuario selecciona "Selecciona cargo", no aplicamos filtro
            setOrderType('');
        } else {
            setOrderType(value);
        }
        setCategory('');
    };

    // const handleCategoryChange = (value) => {
    //     setCategory(value);
    // };

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
                                <div className="inline-dropdowns">
                                    <select onChange={(e) => handleOrderTypeChange(e.target.value)} value={orderType}>
                                        <option value="">Selecciona tipo</option>
                                        <option value="arbitro">Árbitro</option>
                                        <option value="oficial">Oficial</option>
                                    </select>

                                    {orderType && (
                                        <select onChange={(e) => setCategory(e.target.value)} value={category}>
                                            <option value="">Selecciona categoría</option>
                                            {categoryOptions[orderType]?.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
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