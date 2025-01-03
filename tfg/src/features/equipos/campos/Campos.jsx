import React, { useEffect, useState } from 'react';
import './Campos.css';
import { baseURL } from '../../../components/login/Login';
import { MdOutlineWhereToVote, MdBookmarkRemove, MdEditLocationAlt } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Campos = () => {
    const [campos, setCampos] = useState([]);
    const [selectedCampos, setSelectedCampos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCampos, setEditedCampos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCampo, setNewCampo] = useState({
        nombre: '',
        calle: '',
        ubicacion: '',
    });

    const handleOpenModal = () => {
        setNewCampo({ nombre: '', calle: '', ubicacion: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChangeModal = (field, value) => {
        setNewCampo((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveCampo = () => {
        fetch(`${baseURL}/api/campos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCampo),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al guardar el nuevo campo.');
                }
            })
            .then((savedCampo) => {
                setCampos((prevCampos) => [...prevCampos, savedCampo]);
                setIsModalOpen(false);
                alert('Campo creado con éxito.');
            })
            .catch((error) => console.error('Error creando campo:', error));
    };

    const handleCheckboxChange = (id) => {
        setSelectedCampos((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((campoId) => campoId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedCampos.length === 0) {
            alert('Selecciona al menos un campo para eliminar.');
            return;
        }

        fetch(`${baseURL}/api/campos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedCampos }),
        })
            .then((response) => {
                if (response.ok) {
                    setCampos((prevCampos) =>
                        prevCampos.filter((campo) => !selectedCampos.includes(campo.id))
                    );
                    setSelectedCampos([]);
                } else {
                    alert('Error al eliminar los campos.');
                }
            })
            .catch((error) => {
                console.error('Error eliminando campos:', error);
            });
    };

    const handleEditMode = () => {
        setIsEditing(true);
        setEditedCampos([...campos]);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedCampos([]);
    };

    const handleInputChange = (id, field, value) => {
        setEditedCampos((prevCampos) =>
            prevCampos.map((campo) =>
                campo.id === id ? { ...campo, [field]: value } : campo
            )
        );
    };

    const handleSaveChanges = () => {
        fetch(`${baseURL}/api/campos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedCampos),
        })
            .then((response) => {
                if (response.ok) {
                    setCampos(editedCampos);
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

    useEffect(() => {
        fetch(`${baseURL}/api/campos`)
            .then((response) => response.json())
            .then((data) => {
                setCampos(data);
            })
            .catch((error) => console.error('Error fetching campos:', error));
    }, []);

    return (
        <div className="container">
            <h1 className="title">Listado de Campos</h1>

            {isEditing ? (
                <>
                    <button className="button campos-button-guardar" onClick={handleSaveChanges}>
                        Guardar
                    </button>
                    <button className="button campos-button-cancelar" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <button className="button button-guardar" onClick={handleOpenModal}>
                        <MdOutlineWhereToVote style={{ marginRight: '8px' }} />
                        Crear Campo
                    </button>
                    <button className="button button-cancelar" onClick={handleEditMode}>
                        <MdEditLocationAlt style={{ marginRight: '8px' }} />
                        Editar Campo
                    </button>
                </>
            )}


            {isModalOpen && (
                <div className="campos-modal-overlay">
                    <div className="campos-modal-content">
                        <RxCross2 className="campos-modal-close-button" onClick={handleCloseModal} />
                        <h2>Crear Nuevo Campo</h2>
                        <div className="campos-modal-form">
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={newCampo.nombre}
                                    onChange={(e) => handleInputChangeModal('nombre', e.target.value)}
                                />
                            </label>
                            <label>
                                Calle:
                                <input
                                    type="text"
                                    value={newCampo.calle}
                                    onChange={(e) => handleInputChangeModal('calle', e.target.value)}
                                />
                            </label>
                            <label>
                                Ubicación de Google Maps:
                                <input
                                    type="text"
                                    value={newCampo.ubicacion}
                                    onChange={(e) => handleInputChangeModal('ubicacion', e.target.value)}
                                />
                            </label>
                            <button className="button button-guardar" onClick={handleSaveCampo}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="campos-table">
                <thead>
                    <tr>
                        {!isEditing && (
                            <th>
                                <div className="captcha-container" onClick={handleDeleteSelected}>
                                    <MdBookmarkRemove className="interactive-icon" />
                                </div>
                            </th>
                        )}
                        <th>Nombre</th>
                        <th>Calle</th>
                        <th className="celda-ubicacion">Ubicación</th>
                    </tr>
                </thead>
                <tbody>
                    {(isEditing ? editedCampos : campos).map((campo) => (
                        <tr key={campo.id}>
                            {!isEditing && (
                                <td>
                                    <div className="captcha-container">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(campo.id)}
                                            checked={selectedCampos.includes(campo.id)}
                                        />
                                    </div>
                                </td>
                            )}
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={campo.nombre}
                                        onChange={(e) =>
                                            handleInputChange(campo.id, 'nombre', e.target.value)
                                        }
                                    />
                                ) : (
                                    campo.nombre
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={campo.calle}
                                        onChange={(e) =>
                                            handleInputChange(campo.id, 'calle', e.target.value)
                                        }
                                    />
                                ) : (
                                    campo.calle
                                )}
                            </td>
                            <td className="celda-ubicacion">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={campo.ubicacion}
                                        onChange={(e) =>
                                            handleInputChange(campo.id, 'ubicacion', e.target.value)
                                        }
                                    />
                                ) : (
                                    <a
                                        href={campo.ubicacion}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver en Google Maps
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Campos;
