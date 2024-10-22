import React, { useState } from 'react';
import './styles/NuevoArbitro.css';
import { baseURL } from './Login';

const NuevoArbitro = ({ onClose = null, isPublic = false }) => {
    const [nombre, setNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [dni, setDni] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState(''); // Estado para correo electrónico
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [cuentaBancaria, setCuentaBancaria] = useState('');
    const [cargo, setCargo] = useState('arbitro');
    const [coche, setCoche] = useState(false); // Estado para coche
    const [moto, setMoto] = useState(false); // Estado para moto
    const [categoria, setCategoria] = useState('');
    const [permiso, setPermiso] = useState('3');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const arbitroData = {
            nombre,
            primerApellido,
            segundoApellido,
            dni,
            correo_electronico: correoElectronico, // Añadimos el correo electrónico
            fecha_nacimiento: fechaNacimiento,
            telefono,
            domicilio,
            cuenta_bancaria: cuentaBancaria,
            cargo,
            coche,
            moto, // Añadir si el árbitro tiene coche o moto
        };

        if (!isPublic) {
            arbitroData.categoria = categoria;
            arbitroData.permiso = permiso;
        }

        try {
            const response = await fetch(`${baseURL}/arbitros/nuevoarbitro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arbitroData),
            });

            if (response.ok) {
                const data = await response.json();  // Solo si el backend retorna JSON
                alert(data.message || 'Árbitro registrado exitosamente');
                onClose(); // Cierra el formulario después de registrar
            } else {
                // Si la respuesta no es ok, lanza un error
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Error al registrar el árbitro');
            }
        } catch (error) {
            console.error('Error al registrar el árbitro:', error);
            alert('Error al registrar el árbitro');
        }
    };


    return (
        <div className="nuevo-arbitro-container">
            {isPublic ? (
                <h2>Bienvenido al Comité de Árbitro Aragoneses de Baloncesto</h2>
            ) : (
                <h2>Registrar Nuevo Árbitro</h2>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Primer Apellido:</label>
                    <input
                        type="text"
                        value={primerApellido}
                        onChange={(e) => setPrimerApellido(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Segundo Apellido:</label>
                    <input
                        type="text"
                        value={segundoApellido}
                        onChange={(e) => setSegundoApellido(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>DNI:</label>
                    <input
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Correo Electrónico:</label> {/* Nuevo campo de correo */}
                    <input
                        type="email"
                        value={correoElectronico}
                        onChange={(e) => setCorreoElectronico(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Número de Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Domicilio:</label>
                    <input
                        type="text"
                        value={domicilio}
                        onChange={(e) => setDomicilio(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Cuenta Bancaria:</label>
                    <input
                        type="text"
                        value={cuentaBancaria}
                        onChange={(e) => setCuentaBancaria(e.target.value)}
                        required
                    />
                </div>

                {/* Coche y Moto en la misma línea */}
                <div className="vehiculos-container">
                    <div className="vehiculos-item">
                        <label>Coche:</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={coche}
                                onChange={(e) => setCoche(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="vehiculos-item">
                        <label>Moto:</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={moto}
                                onChange={(e) => setMoto(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div>
                    <label>Cargo:</label>
                    <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
                        <option value="arbitro">Árbitro</option>
                        <option value="oficial">Oficial</option>
                    </select>
                </div>

                {/* Solo muestra los campos de categoría y permiso si no es público */}
                {!isPublic && (
                    <>
                        <div>
                            <label>Categoría:</label>
                            <input
                                type="text"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Permiso:</label>
                            <select value={permiso} onChange={(e) => setPermiso(e.target.value)}>
                                <option value="1">Admin</option>
                                <option value="2">Técnico</option>
                                <option value="3">Árbitro - Oficial</option>
                            </select>
                        </div>
                    </>
                )}

                <button type="submit">Registrar</button>
                {!isPublic && onClose && (
                    <button type="button" onClick={onClose}>Cancelar</button>
                )}
            </form>
        </div>
    );
};

export default NuevoArbitro;
