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

    const categoriasCargo1 = ['ACB', '1 FEB', '2 FEB', '3 FEB', 'A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela'];
    const categoriasCargo2 = ['ACB', 'LF', 'EBA', '1 DIV', 'P1', 'P2', 'P3'];

    const getNivelesByCategoria = (categoria, cargo) => {
        if (cargo === '1') {
            switch (categoria) {
                case 'ACB':
                case '1 FEB':
                case '2 FEB':
                    return ['1'];
                case '3 FEB':
                    return ['1', '2'];
                case 'A1':
                case 'A2':
                case 'A3':
                case 'A4':
                case 'P1':
                case 'P2':
                case 'P3':
                case 'Escuela':
                    return ['1', '2', '3'];
                default:
                    return [];
            }
        } else if (cargo === '2') {
            switch (categoria) {
                case 'ACB':
                case 'LF':
                    return ['1', '2'];
                case '1 DIV':
                case 'P1':
                case 'P2':
                    return ['1', '2', '3'];
                case 'P3':
                    return ['1', '2'];
                default:
                    return [];
            }
        }
    };

    useEffect(() => {
        const storedArbitro = localStorage.getItem('arbitro');
        if (storedArbitro) {
            const parsedArbitro = JSON.parse(storedArbitro);
            setArbitro(parsedArbitro);
            setUpdatedData({
                ...parsedArbitro,
                // Mantener el nivel actual del arbitro
                nivel: parsedArbitro.nivel
            });
        }
    }, []);

    if (!arbitro) {
        return <p>Loading...</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Actualiza el valor del campo en el estado
        setUpdatedData(prevData => ({ ...prevData, [name]: value }));

        // Si se cambia la categoría, actualizamos también el nivel
        if (name === 'categoria') {
            const nuevosNiveles = getNivelesByCategoria(value, arbitro.cargo);
            setUpdatedData(prevData => ({
                ...prevData,
                categoria: value,
                nivel: nuevosNiveles.includes(prevData.nivel) ? prevData.nivel : nuevosNiveles[0] // Mantiene el nivel si es válido
            }));
        }
    };

    const actualizarPerfil = async (id) => {
        try {
            const response = await axios.put(`${baseURL}/api/arbitro/${id}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsEditing(false);
            setArbitro(updatedData);
            localStorage.setItem('arbitro', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response ? error.response.data : error.message);
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setUpdatedData(arbitro);
    };

    const isEditable = (field) => {
        if (arbitro.permiso === '1') {
            return true;
        } else if (arbitro.permiso === '2' || arbitro.permiso === '3') {
            return !['username', 'alias', 'categoria', 'nivel'].includes(field);
        }
        return false;
    };

    const categorias = arbitro.cargo === '1' ? categoriasCargo1 : categoriasCargo2;
    const niveles = getNivelesByCategoria(updatedData.categoria, arbitro.cargo);

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
                                {arbitro.permiso === '1' ? 'Admin' :
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
                                    <span>{arbitro.categoria} - {arbitro.nivel}</span>
                                )}
                            </li>
                        </ul>
                        {isEditing && arbitro.permiso === '1' && (
                            <li>
                                <FaTag className="icon" />
                                <strong>Nivel:</strong>
                                <select name="nivel" value={updatedData.nivel} onChange={handleChange}>
                                    {niveles.map(nivel => (
                                        <option key={nivel} value={nivel}>{nivel}</option>
                                    ))}
                                </select>
                            </li>
                        )}
                    </div>
                </div>
            </div>

            <div className="boton-container">
                {isEditing ? (
                    <>
                        <button className="aceptar-btn" onClick={() => actualizarPerfil(arbitro.id)}>Aceptar</button>
                        <button className="cancelar-btn" onClick={cancelEdit}>Cancelar</button>
                    </>
                ) : (
                    <button className="editar-perfil-btn" onClick={toggleEditing}>
                        <GiPencilRuler /> Editar perfil
                    </button>
                )}
            </div>
        </div>
    );
};

export default Perfil;
