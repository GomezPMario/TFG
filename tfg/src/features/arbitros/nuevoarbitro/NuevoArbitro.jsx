import React, { useState, useEffect } from 'react';
import './NuevoArbitro.css';
import { baseURL } from '../../../components/login/Login';

const NuevoArbitro = ({ onClose = null, isPublic = false, isManual = false, onArbitroAdded = null }) => {
    const [nombre, setNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [dni, setDni] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [cuentaBancaria, setCuentaBancaria] = useState('');
    const [cargo, setCargo] = useState('arbitro');
    const [coche, setCoche] = useState(false);
    const [moto, setMoto] = useState(false);
    const [categoria, setCategoria] = useState('ACB');  // Valor por defecto
    const [nivel, setNivel] = useState('1');
    const [permiso, setPermiso] = useState('3');

    // Listas de categorías según el cargo
    const categoriasCargo1 = ['ACB', '1 FEB', '2 FEB', '3 FEB', 'A1', 'A2', 'A3', 'A4', 'P1', 'P2', 'P3', 'Escuela'];
    const categoriasCargo2 = ['ACB', 'LF', 'EBA', '1 DIV', 'P1', 'P2', 'P3'];

    // Obtener niveles según la categoría seleccionada
    const getNivelesByCategoria = (categoria, cargo) => {
        if (cargo === 'arbitro') {
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
        } else if (cargo === 'oficial') {
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

    // Actualiza la lista de niveles cuando se cambia la categoría o el cargo
    useEffect(() => {
        const nuevosNiveles = getNivelesByCategoria(categoria, cargo);
        setNivel(nuevosNiveles[0]);  // Selecciona el primer nivel por defecto
    }, [categoria, cargo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let categoria_id;

            if (isManual) {
                // Caso manual (el usuario selecciona la categoría y nivel)
                const categoriaResponse = await fetch(`${baseURL}/arbitros/categoria-id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ categoria, nivel }),  // Enviamos categoría y nivel seleccionados
                });

                if (!categoriaResponse.ok) {
                    throw new Error('Error al obtener el categoria_id');
                }

                const data = await categoriaResponse.json();
                categoria_id = data.categoria_id;
            } else {
                // Si no es manual, asignar categoria_id a 35 automáticamente
                categoria_id = 35;
            }

            // Ahora, seguir con el proceso de registro usando el `categoria_id` obtenido o asignado
            const arbitroData = {
                nombre,
                primerApellido,
                segundoApellido,
                dni,
                correo_electronico: correoElectronico,
                fecha_nacimiento: fechaNacimiento,
                telefono,
                domicilio,
                cuenta_bancaria: cuentaBancaria,
                cargo,
                coche,
                moto,
                categoria_id,  // Usamos el categoria_id aquí
                permiso,
            };

            const response = await fetch(`${baseURL}/arbitros/nuevoarbitro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arbitroData),
            });

            if (response.ok) {
                const nuevoArbitro = await response.json();
                console.log("Árbitro creado en backend:", nuevoArbitro); // Para depurar
                alert('Árbitro registrado exitosamente');
                onClose && onClose();
                onArbitroAdded && onArbitroAdded(nuevoArbitro); // Pasa el árbitro al componente padre
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Error al registrar el árbitro');
            }
        } catch (error) {
            console.error('Error al registrar el árbitro:', error);
            alert('Error al registrar el árbitro');
        }
    };

    const categorias = cargo === 'arbitro' ? categoriasCargo1 : categoriasCargo2;
    const niveles = getNivelesByCategoria(categoria, cargo);

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
                    <label>Correo Electrónico:</label>
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

                {/* Solo se muestran los campos de categoría, nivel y permiso si no es público */}
                {!isPublic && (
                    <>
                        <div>
                            <label>Categoría:</label>
                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                                {categorias.map(categoria => (
                                    <option key={categoria} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Nivel:</label>
                            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                                {niveles.map(nivel => (
                                    <option key={nivel} value={nivel}>{nivel}</option>
                                ))}
                            </select>
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
