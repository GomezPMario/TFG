import React, { useEffect, useState } from 'react';
import './Equipos.css';
import { baseURL } from '../../../components/login/Login';
import { MdBookmarkRemove } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TbCategoryPlus } from "react-icons/tb";
import { MdEdit } from "react-icons/md";

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

    useEffect(() => {
        if (!isEditing) {
            setEditedEquipos(equipos.map((equipo) => ({
                ...equipo,
                nombre: equipo.nombre // Asegúrate de copiar `equipo_nombre` a `nombre`
            })));
        }
    }, [equipos, isEditing]);

    useEffect(() => {
        console.log("Equipos cargados:", equipos);
    }, [equipos]);

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
        if (!newEquipo.nombre || !newEquipo.categoria_id || !newEquipo.campo_nombre) {
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
        setEditedEquipos(equipos.map((equipo) => ({ ...equipo }))); // Copia profunda
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
        console.log(`Cambiando ${field} del equipo con id ${id} a ${value}`);
    };

    const handleSaveChanges = () => {
        const updatedEquipos = editedEquipos.filter((edited) => {
            const original = equipos.find((e) => e.id === edited.id);
            return (
                original &&
                (original.nombre !== edited.nombre ||
                    original.categoria_id !== edited.categoria_id ||
                    original.campo_id !== edited.campo_id)
            );
        });

        // Validar que no haya campos nulos o vacíos
        for (const equipo of updatedEquipos) {
            if (!equipo.nombre || !equipo.categoria_id || !equipo.campo_id) {
                alert("Todos los campos son obligatorios para cada equipo.");
                return;
            }
        }

        if (updatedEquipos.length === 0) {
            alert('No hay cambios para guardar.');
            setIsEditing(false);
            return;
        }

        console.log("Datos a actualizar:", updatedEquipos);

        fetch(`${baseURL}/api/equipos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEquipos),
        })
            .then((response) => {
                if (response.ok) {
                    // Realiza una nueva solicitud GET para obtener los equipos actualizados
                    return fetch(`${baseURL}/api/equipos`)
                        .then((response) => response.json())
                        .then((data) => {
                            setEquipos(data); // Actualiza el estado con los datos más recientes
                            setIsEditing(false); // Sal del modo edición
                            alert('Cambios guardados con éxito.');
                        });
                } else {
                    throw new Error('Error al guardar los cambios.');
                }
            })
            .catch((error) => {
                console.error('Error guardando cambios:', error);
                alert('Hubo un error al guardar los cambios.');
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
                            <TbCategoryPlus style={{ marginRight: '8px' }} />
                        Crear Equipo
                    </button>
                    <button className="button button-cancelar" onClick={handleEditMode}>
                            <MdEdit style={{ marginRight: '8px' }} />
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
                                    value={newEquipo.nombre}
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
                                <div className="interactive-icon-container" onClick={handleDeleteSelected}>
                                    <MdBookmarkRemove className="interactive-icon" />
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
                                    <div className="captcha-container">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(equipo.id)}
                                            checked={selectedEquipos.includes(equipo.id)}
                                                />
                                    </div>
                            </td>
                        )}
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedEquipos.find((e) => e.id === equipo.id)?.nombre || ''}
                                    onChange={(e) => handleInputChange(equipo.id, 'nombre', e.target.value)}
                                />
                            ) : (
                                equipo.nombre
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <select
                                    value={editedEquipos.find((e) => e.id === equipo.id)?.categoria_id || ''}
                                    onChange={(e) => handleInputChange(equipo.id, 'categoria_id', e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
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
                                    value={equipo.campo_id} // Usar el valor actual del campo en edición
                                    onChange={(e) =>
                                        handleInputChange(equipo.id, 'campo_id', e.target.value)
                                    }
                                >
                                    {campos.map((campo) => (
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