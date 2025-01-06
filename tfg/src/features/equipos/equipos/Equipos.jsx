import React, { useEffect, useState } from 'react';
import './Equipos.css';
import { baseURL } from '../../../components/login/Login';
import { MdBookmarkRemove, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Equipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedEquipos, setSelectedEquipos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEquipos, setEditedEquipos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEquipo, setNewEquipo] = useState({
        nombre: '',
        categoria_id: '',
        campo: '',
    });
    const [campos, setCampos] = useState([]);

    useEffect(() => {
        // Fetch equipos
        fetch(`${baseURL}/api/equipos`)
            .then((response) => response.json())
            .then((data) => setEquipos(data))
            .catch((error) => console.error('Error al cargar equipos:', error));

        // Fetch categorías
        fetch(`${baseURL}/api/categorias`)
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error('Error al cargar categorías:', error));

        fetch(`${baseURL}/api/campos`)
            .then((response) => response.json())
            .then((data) => setCampos(data))
            .catch((error) => console.error('Error al cargar campos:', error));
    }, []);

    const handleOpenModal = () => {
        setNewEquipo({ nombre: '', categoria_id: '', campo: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChangeModal = (field, value) => {
        setNewEquipo((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEquipo = () => {
        if (!newEquipo.equipo_nombre || !newEquipo.categoria_id || !newEquipo.campo_nombre) {
            alert("Debe completar todos los campos antes de guardar.");
            return;
        }

        fetch(`${baseURL}/api/equipos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEquipo),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al guardar el nuevo equipo.');
                }
            })
            .then(() => {
                // Refresh equipos
                fetch(`${baseURL}/api/equipos`)
                    .then((response) => response.json())
                    .then((data) => setEquipos(data))
                    .catch((error) => console.error('Error al actualizar equipos:', error));

                setIsModalOpen(false);
                alert('Equipo creado con éxito.');
            })
            .catch((error) => console.error('Error creando equipo:', error));
    };

    const handleCheckboxChange = (id) => {
        setSelectedEquipos((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((equipoId) => equipoId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedEquipos.length === 0) {
            alert('Selecciona al menos un equipo para eliminar.');
            return;
        }

        fetch(`${baseURL}/api/equipos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedEquipos }),
        })
            .then((response) => {
                if (response.ok) {
                    setEquipos((prevEquipos) =>
                        prevEquipos.filter((equipo) => !selectedEquipos.includes(equipo.id))
                    );
                    setSelectedEquipos([]);
                    alert('Equipo(s) eliminado(s) correctamente.');
                } else {
                    alert('Error al eliminar los equipos.');
                }
            })
            .catch((error) => {
                console.error('Error eliminando equipos:', error);
            });
    };

    const handleEditMode = () => {
        setIsEditing(true);
        setEditedEquipos([...equipos]);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedEquipos([]);
    };

    const handleInputChange = (id, field, value) => {
        setEditedEquipos((prevEquipos) =>
            prevEquipos.map((equipo) =>
                equipo.id === id ? { ...equipo, [field]: value } : equipo
            )
        );
    };

    const handleSaveChanges = () => {
        const updatedEquipos = editedEquipos.filter((edited) => {
            const original = equipos.find((e) => e.id === edited.id);
            return (
                original &&
                (original.nombre !== edited.nombre ||
                    original.categoria_id !== edited.categoria_id ||
                    original.campo_id !== edited.campo_id) // Nota: aquí asegúrate de usar campo_id
            );
        });

        if (updatedEquipos.length === 0) {
            alert('No hay cambios para guardar.');
            setIsEditing(false);
            return;
        }

        console.log("Datos a actualizar:", updatedEquipos); // Agrega esto para inspeccionar

        fetch(`${baseURL}/api/equipos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEquipos),
        })
            .then((response) => {
                if (response.ok) {
                    setEquipos(editedEquipos);
                    setIsEditing(false);
                    alert('Cambios guardados con éxito.');
                } else {
                    alert('Error al guardar los cambios.');
                }
            })
            .catch((error) => {
                console.error('Error guardando cambios:', error);
            });
    };

    return (
        <div className="container">
            <h1 className="title">Listado de Equipos</h1>

            {isEditing ? (
                <>
                    <button className="button equipo-button-guardar" onClick={handleSaveChanges}>
                        Guardar
                    </button>
                    <button className="button equipo-button-cancelar" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <button className="button button-guardar" onClick={handleOpenModal}>
                        Crear Equipo
                    </button>
                    <button className="button button-cancelar" onClick={handleEditMode}>
                        Editar Equipo
                    </button>
                </>
            )}

            {isModalOpen && (
                <div className="equipos-modal-overlay">
                    <div className="equipos-modal-content">
                        <RxCross2 className="equipos-modal-close-button" onClick={handleCloseModal} />
                        <h2>Crear Nuevo Equipo</h2>
                        <div className="equipos-modal-form">
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={newEquipo.equipo_nombre}
                                    onChange={(e) => handleInputChangeModal('nombre', e.target.value)}
                                />
                            </label>
                            <label>
                                Categoría:
                                <select
                                    value={newEquipo.categoria_id}
                                    onChange={(e) => handleInputChangeModal('categoria_id', e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Campo:
                                <input
                                    type="text"
                                    value={newEquipo.campo_nombre}
                                    onChange={(e) => handleInputChangeModal('campo', e.target.value)}
                                />
                            </label>
                            <button className="button button-guardar" onClick={handleSaveEquipo}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className={`equipos-table ${isEditing ? 'editing' : ''}`}>
            <thead>
                <tr>
                    {!isEditing && (
                        <th>
                            <div onClick={handleDeleteSelected}>
                                <MdBookmarkRemove />
                            </div>
                        </th>
                    )}
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Campo</th>
                </tr>
            </thead>
            <tbody>
                {(isEditing ? editedEquipos : equipos).map((equipo) => (
                    <tr key={equipo.id}>
                        {!isEditing && (
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(equipo.id)}
                                    checked={selectedEquipos.includes(equipo.id)}
                                />
                            </td>
                        )}
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={equipo.equipo_nombre}
                                    onChange={(e) =>
                                        handleInputChange(equipo.id, 'nombre', e.target.value)
                                    }
                                />
                            ) : (
                                equipo.equipo_nombre
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <select
                                    value={equipo.categoria_id} // Usamos la categoría actual del equipo
                                    onChange={(e) =>
                                        handleInputChange(equipo.id, 'categoria_id', e.target.value)
                                    }
                                >
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                equipo.categoria_nombre || "Sin categoría"
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <select
                                    value={equipo.campo_id} // Usamos el campo actual del equipo
                                    onChange={(e) =>
                                        handleInputChange(equipo.id, 'campo_id', e.target.value)
                                    }
                                >
                                    {/* Muestra el campo actual primero */}
                                    <option value={equipo.campo_id}>
                                        {equipo.campo_nombre || "Sin campo"}
                                    </option>
                                    {/* Muestra el resto de los campos, excluyendo el actual */}
                                    {campos
                                        .filter((campo) => campo.id !== equipo.campo_id)
                                        .map((campo) => (
                                            <option key={campo.id} value={campo.id}>
                                                {campo.nombre}
                                            </option>
                                        ))}
                                </select>
                            ) : (
                                equipo.campo_nombre || "Sin campo"
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div >
    );
};

export default Equipos;