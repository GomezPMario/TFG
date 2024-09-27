import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Perfil.css';
import { baseURL } from './Login';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaKey, FaTag } from 'react-icons/fa';
import { GiPencilRuler } from "react-icons/gi";

const Perfil = () => {
    const [arbitro, setArbitro] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const categorias = ['A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela'];
    const subcategorias = ['Principal', 'Auxiliar', 'Comodín'];

    useEffect(() => {
        const storedArbitro = localStorage.getItem('arbitro');
        if (storedArbitro) {
            const parsedArbitro = JSON.parse(storedArbitro);
            setArbitro(parsedArbitro);
            setUpdatedData(parsedArbitro); // Inicializa el estado de los datos actualizados
        }
    }, []);

    if (!arbitro) {
        return <p>Loading...</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prevData => ({ ...prevData, [name]: value }));
    };

    const actualizarPerfil = async (id) => {
        try {
            const response = await axios.put(`${baseURL}/api/updatePerfil/${id}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            setIsEditing(false); // Desactiva el modo de edición
            setArbitro(updatedData); // Actualiza el árbitro con los nuevos datos
            localStorage.setItem('arbitro', JSON.stringify(updatedData)); // Guarda en localStorage
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response ? error.response.data : error.message);
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const isEditable = (field) => {
        if (arbitro.permiso === '1') {
            return true; // Admin puede editar todo
        } else if (arbitro.permiso === '2' || arbitro.permiso === '3') {
            return !['username', 'alias', 'categoria', 'subcategoria'].includes(field);
        }
        return false; // Otros casos no deberían editar
    };

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                <h1>Perfil de {arbitro.nombre}</h1>
                <div className="perfil-content">
                    <div className="perfil-column">
                        <ul>
                            <li><FaUser className="icon" /> <strong>Usuario:</strong> {isEditing && isEditable('username') ?
                                <input type="text" name="username" value={updatedData.username} onChange={handleChange} />
                                : arbitro.username}
                            </li>
                            <li><FaKey className="icon" /> <strong>Contraseña:</strong> {isEditing && isEditable('password') ?
                                <input type="text" name="password" value={updatedData.password} onChange={handleChange} />
                                : arbitro.password}
                            </li>
                            <li><FaTag className="icon" /> <strong>Alias:</strong> {isEditing && isEditable('alias') ?
                                <input type="text" name="alias" value={updatedData.alias} onChange={handleChange} />
                                : arbitro.alias}
                            </li>
                            <li><FaTag className="icon" /> <strong>Nº de Colegiado:</strong> {isEditing && arbitro.permiso === '1' ?
                                <input type="text" name="numero_colegiado" value={updatedData.numero_colegiado} onChange={handleChange} />
                                : arbitro.numero_colegiado}
                            </li>
                            <li><FaPhone className="icon" /> <strong>Teléfono:</strong> {isEditing && isEditable('telefono') ?
                                <input type="text" name="telefono" value={updatedData.telefono} onChange={handleChange} />
                                : arbitro.telefono}
                            </li>
                        </ul>
                    </div>
                    <div className="perfil-column">
                        <ul>
                            <li><FaUser className="icon" /> <strong>Nombre:</strong> {isEditing && isEditable('nombre') ?
                                <input type="text" name="nombre" value={updatedData.nombre} onChange={handleChange} />
                                : arbitro.nombre}
                            </li>
                            <li><FaUser className="icon" /> <strong>Apellido:</strong> {isEditing && isEditable('apellido') ?
                                <input type="text" name="apellido" value={updatedData.apellido} onChange={handleChange} />
                                : arbitro.apellido}
                            </li>
                            <li><FaEnvelope className="icon" />
                                <strong>Email:</strong>
                                {isEditing && isEditable('email') ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={updatedData.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="email-section">{arbitro.email}</div>
                                )}
                            </li>
                            <li><FaHome className="icon" /> <strong>Domicilio:</strong> {isEditing && isEditable('domicilio') ?
                                <input type="text" name="domicilio" value={updatedData.domicilio} onChange={handleChange} />
                                : arbitro.domicilio}
                            </li>
                            <li><FaUser className="icon" /> <strong>Cuenta:</strong> {isEditing && isEditable('cuenta') ?
                                <input type="text" name="cuenta" value={updatedData.cuenta} onChange={handleChange} />
                                : arbitro.cuenta}
                            </li>
                        </ul>
                    </div>
                    <div className="perfil-column">
                        <ul>
                            <li>
                                <FaTag className="icon" />
                                <strong>Permiso:</strong>
                                {isEditing && arbitro.permiso === '1' ?
                                    <select name="permiso" value={updatedData.permiso} onChange={handleChange}>
                                        <option value="1">Admin</option>
                                        <option value="2">Técnico</option>
                                        <option value="3">Árbitro - Oficial</option>
                                    </select>
                                    : arbitro.permiso === '1' ? 'Admin' :
                                        arbitro.permiso === '2' ? 'Técnico' : 'Árbitro - Oficial'
                                }
                            </li>
                            <li>
                                <FaTag className="icon" />
                                <strong>Categoría:</strong>
                                {isEditing && arbitro.permiso === '1' ? (
                                    <select name="categoria" value={updatedData.categoria} onChange={handleChange}>
                                        {categorias.map(categoria => (
                                            <option key={categoria} value={categoria}>{categoria}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{arbitro.categoria} - {arbitro.subcategoria}</span>
                                )}
                            </li>
                            {/* Campo para la subcategoría */}
                            {isEditing && arbitro.permiso === '1' && (
                                <li>
                                    <FaTag className="icon" />
                                    <strong>Subcategoría:</strong>
                                    <select name="subcategoria" value={updatedData.subcategoria} onChange={handleChange}>
                                        {subcategorias.map(subcategoria => (
                                            <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
                                        ))}
                                    </select>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <button className="editar-perfil-btn" onClick={toggleEditing}>
                <GiPencilRuler /> {isEditing ? 'Cancelar' : 'Editar perfil'}
            </button>
        </div>
    );
};

export default Perfil;
