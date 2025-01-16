import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Perfil.css';
import Informes from '../informes/Informes'
import { baseURL } from '../../../components/login/Login';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaKey, FaTag, FaCarSide } from 'react-icons/fa';
import { RiMotorbikeFill } from "react-icons/ri";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GiPencilRuler, GiWhistle, GiPiggyBank } from "react-icons/gi";
import { BiCategory } from "react-icons/bi";
import { HiMiniFingerPrint } from "react-icons/hi2";

const Perfil = ({ arbitroId, isAdminView = false }) => {
    const [arbitro, setArbitro] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [coche, setCoche] = useState(false);
    const [moto, setMoto] = useState(false);
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);

    const [arbitroLogueado, setArbitroLogueado] = useState(null);
    const [password, setPassword] = useState('');

    const formatToISODate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const calcularEdad = (isoString) => {
        const birthDate = new Date(isoString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        const arbitroLogueado = JSON.parse(localStorage.getItem('arbitro'));
        const id = arbitroId || arbitroLogueado?.id; // Usar el id del prop o del usuario logueado
        console.log('Datos del árbitro:', arbitroLogueado);
        
        if (id) {
            const fetchArbitro = async () => {
                try {
                    const response = await axios.get(`${baseURL}/arbitros/${id}`);
                    setArbitro(response.data);
                    setUpdatedData(response.data);

                    const vehiculo = response.data.vehiculo;
                    setCoche(vehiculo === '1' || vehiculo === '3');
                    setMoto(vehiculo === '2' || vehiculo === '3');
                    setFechaNacimiento(formatToISODate(response.data.fecha_nacimiento));
                } catch (error) {
                    console.error('Error al cargar los datos del árbitro:', error);
                }
            };

            const fetchFotoPerfil = async () => {
                try {
                    const response = await axios.get(`${baseURL}/arbitros/foto/${id}`);
                    setFotoPerfil(response.data.foto);
                } catch (error) {
                    console.error('Error al obtener la foto de perfil:', error);
                }
            };

            fetchArbitro();
            fetchFotoPerfil();
        }
    }, [arbitroId]);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('arbitro'));
        setArbitroLogueado(loggedInUser);

        const fetchArbitro = async () => {
            try {
                const response = await axios.get(`${baseURL}/arbitros/${arbitroId}`);
                setArbitro(response.data);
                setUpdatedData(response.data);
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            }
        };

        if (arbitroId) fetchArbitro();
    }, [arbitroId]);

    const handlePasswordReset = async () => {
        try {
            await axios.put(`${baseURL}/arbitros/${arbitro.id}/reset-password`, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Contraseña restablecida a "12345".');
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            alert('Error al restablecer la contraseña.');
        }
    };

    if (!arbitro) {
        return <p>Loading...</p>;
    }

    const handlePhotoChange = async (e) => {
        if (!isEditing) { // Permitir cambiar la foto solo si no está en modo de edición
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result.split(',')[1];
                    try {
                        const response = await axios.put(
                            `${baseURL}/arbitros/${arbitro.id}/foto`,
                            { foto: base64Image },
                            { headers: { 'Content-Type': 'application/json' } }
                        );
                        // Actualizar la foto en el estado local inmediatamente
                        if (response.data.foto) {
                            setFotoPerfil(response.data.foto);
                        }
                    } catch (error) {
                        console.error('Error al actualizar la foto de perfil:', error);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prevData => ({ ...prevData, [name]: value }));
        if (name === 'fecha_nacimiento') {
            setFechaNacimiento(value);
            setUpdatedData(prevData => ({ ...prevData, fecha_nacimiento: value }));
        }
    };

    const handleVehiculoChange = (vehiculo) => {
        if (vehiculo === 'coche') {
            const newCocheState = !coche;
            setCoche(newCocheState);
            const newVehiculoValue = newCocheState && moto ? '3' : newCocheState ? '1' : moto ? '2' : '0';
            setUpdatedData(prevData => ({ ...prevData, vehiculo: newVehiculoValue }));
        } else if (vehiculo === 'moto') {
            const newMotoState = !moto;
            setMoto(newMotoState);
            const newVehiculoValue = coche && newMotoState ? '3' : coche ? '1' : newMotoState ? '2' : '0';
            setUpdatedData(prevData => ({ ...prevData, vehiculo: newVehiculoValue }));
        }
    };

    // const actualizarPerfil = async (id) => {
    //     try {
    //         const dataToSend = { ...updatedData, fecha_nacimiento: fechaNacimiento };
    //         await axios.put(`${baseURL}/arbitros/${id}`, dataToSend, {
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         setIsEditing(false);
    //         setArbitro(dataToSend);
    //         localStorage.setItem('arbitro', JSON.stringify(dataToSend));
    //     } catch (error) {
    //         console.error('Error al actualizar el perfil:', error.response ? error.response.data : error.message);
    //     }
    // };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Actualiza solo si el usuario escribe algo
    };

    const actualizarPerfil = async (id) => {
        try {
            // Crear un clon de los datos actualizados
            const dataToSend = { ...updatedData, fecha_nacimiento: fechaNacimiento };

            // Verificar si el campo de contraseña tiene un valor válido
            if (password.trim()) {
                dataToSend.password = password; // Incluir la contraseña solo si no está vacía
            } else {
                delete dataToSend.password; // Eliminar el campo si está vacío
            }

            // Realizar la solicitud PUT
            await axios.put(`${baseURL}/arbitros/${id}`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Finalizar la edición y limpiar los estados
            setIsEditing(false);
            setArbitro(dataToSend);
            setPassword(''); // Limpia el estado del input de contraseña
            localStorage.setItem('arbitro', JSON.stringify(dataToSend));
            alert('Perfil actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response ? error.response.data : error.message);
            alert('Error al actualizar el perfil.');
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setUpdatedData(arbitro);
        setFechaNacimiento(formatToISODate(arbitro.fecha_nacimiento));
        const vehiculo = arbitro.vehiculo;
        setCoche(vehiculo === '1' || vehiculo === '3');
        setMoto(vehiculo === '2' || vehiculo === '3');
    };

    const isEditable = (field) => {
        if (isAdminView) {
            return true;
        }

        if (arbitro.permiso === '1') {
            return true;
        } else if (arbitro.permiso === '2' || arbitro.permiso === '3') {
            return !['username', 'alias', 'categoria', 'nivel'].includes(field);
        }
        return false;
    };

    const categorias = arbitro.cargo === '1' ? ['ACB', '1 FEB', '2 FEB', '3 FEB', 'A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela'] : ['ACB', 'LF', 'EBA', '1 DIV', 'P1', 'P2', 'P3'];
    const niveles = arbitro.cargo === '1' ? ['1', '2', '3'] : ['1', '2'];

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                />

                {fotoPerfil ? (
                    <img
                        src={fotoPerfil}
                        alt="Foto de perfil"
                        className="perfil-foto"
                        onClick={() => !isEditing && document.getElementById('fileInput').click()}
                    />
                ) : (
                    <div
                        className="perfil-foto-placeholder"
                        onClick={() => !isEditing && document.getElementById('fileInput').click()}
                    >
                        <p>+</p>
                    </div>
                )}

                {isAdminView && (
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
                )}

                <div className="perfil-content">
                    <div className="perfil-column">
                        <ul>
                            <li><HiMiniFingerPrint className="icon" /> <strong>Usuario:</strong> {isEditing && isEditable('username') ?
                                <input type="text" name="username" value={updatedData.username} onChange={handleChange} />
                                : arbitro.username}
                            </li>
                            {/* <li><FaKey className="icon" /> <strong>Contraseña:</strong>
                                {isEditing && isEditable('password') ?
                                <input type="text" name="password" value={updatedData.password} onChange={handleChange} />
                                : arbitro.password}
                                {arbitroLogueado?.id !== arbitro.id && (
                                    <button className="restablecer-btn" onClick={handlePasswordReset}>
                                        Restablecer
                                    </button>
                                )}
                            </li> */}
                            <li>
                                <FaKey className="icon" /> <strong>Contraseña:</strong>
                                {isEditing ? (
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Nueva contraseña"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                ) : (
                                    arbitroLogueado?.id !== arbitro.id && (
                                        <button className="restablecer-btn" onClick={handlePasswordReset}>
                                            Restablecer
                                        </button>
                                    )
                                )}
                            </li>

                            <li><FaTag className="icon" /> <strong>Alias:</strong> {isEditing && isEditable('alias') ?
                                <input type="text" name="alias" value={updatedData.alias} onChange={handleChange} />
                                : arbitro.alias}
                            </li>
                            <li><GiWhistle className="icon" /> <strong>Nº de Colegiado:</strong> {isEditing && arbitro.permiso === '1' ?
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
                            <li>
                                <FaEnvelope className="icon" />
                                <strong>Email:</strong>
                                {isEditing && isEditable('email') ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={updatedData.email}
                                        onChange={handleChange}
                                        className="editable-email"
                                    />
                                ) : (
                                    <span className="email-section">{arbitro.email}</span>
                                )}
                            </li>
                            <li><FaHome className="icon" /> <strong>Domicilio:</strong> {isEditing && isEditable('domicilio') ?
                                <input type="text" name="domicilio" value={updatedData.domicilio} onChange={handleChange} />
                                : arbitro.domicilio}
                            </li>
                            <li><GiPiggyBank className="icon" /> <strong>Cuenta:</strong> {isEditing && isEditable('cuenta') ?
                                <input type="text" name="cuenta" value={updatedData.cuenta} onChange={handleChange} />
                                : arbitro.cuenta}
                            </li>
                        </ul>
                    </div>
                    <div className="perfil-column">
                        <ul>
                            <li>
                                <LiaBirthdayCakeSolid className="icon" />
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="fecha_nacimiento"
                                        value={fechaNacimiento}
                                        onChange={handleChange}
                                        required
                                    />
                                ) : (
                                    <span>
                                        {formatDate(arbitro.fecha_nacimiento)} - {calcularEdad(arbitro.fecha_nacimiento)} años
                                    </span>
                                )}
                            </li>
                            <li>
                                <FaCarSide className="icon" />
                                <strong>Coche:</strong>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={coche}
                                        onChange={() => handleVehiculoChange('coche')}
                                        disabled={!isEditing}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </li>
                            <li>
                                <RiMotorbikeFill className="icon" />
                                <strong>Moto:</strong>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={moto}
                                        onChange={() => handleVehiculoChange('moto')}
                                        disabled={!isEditing}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </li>
                            <li>
                                <FaTag className="icon" />
                                <strong>Permiso:</strong>
                                {isEditing && isAdminView ? (
                                    <select
                                        name="permiso"
                                        value={updatedData.permiso}
                                        onChange={handleChange}
                                    >
                                        <option value="1">Admin</option>
                                        <option value="2">Técnico</option>
                                        <option value="3">Árbitro - Oficial</option>
                                    </select>
                                ) : (
                                    arbitro.permiso === '1' ? 'Admin' :
                                        arbitro.permiso === '2' ? 'Técnico' : 'Árbitro - Oficial'
                                )}
                            </li>
                            <li>
                                <BiCategory className="icon" />
                                <strong>Categoría:</strong>
                                {isEditing && isAdminView ? (
                                    <select
                                        name="categoria"
                                        value={updatedData.categoria}
                                        onChange={handleChange}
                                    >
                                        {categorias.map((categoria) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{arbitro.categoria} - {arbitro.nivel}</span>
                                )}
                            </li>
                            {isEditing && isAdminView && (
                                <li>
                                    <FaTag className="icon" />
                                    <strong>Nivel:</strong>
                                    <select
                                        name="nivel"
                                        value={updatedData.nivel}
                                        onChange={handleChange}
                                    >
                                        {niveles.map((nivel) => (
                                            <option key={nivel} value={nivel}>
                                                {nivel}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                            )}

                        </ul>
                    </div>
                </div>
                {isAdminView && (
                    <div className="informes-section">
                        <h2>Informes realizados</h2>
                        <Informes arbitroId={arbitroId} isAdminView={true} />
                    </div>
                )}
            </div>

            {!isAdminView && (
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
            )}
        </div>
    );
};

export default Perfil;