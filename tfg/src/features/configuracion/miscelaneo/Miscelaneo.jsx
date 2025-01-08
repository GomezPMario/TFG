import React, { useEffect, useState } from 'react';
import './Miscelaneo.css';
import { baseURL } from '../../../components/login/Login';
import { MdBookmarkRemove } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TbCategoryPlus } from "react-icons/tb";
import { MdEdit } from "react-icons/md";

const Miscelaneo = () => {
    const [miscelaneo, setMiscelaneo] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        nombre: '',
        importe: '',
    });

    useEffect(() => {
        fetchMiscelaneo();
    }, []);

    const fetchMiscelaneo = async () => {
        try {
            const response = await fetch(`${baseURL}/api/miscelaneo`);
            const result = await response.json();
            console.log('Respuesta de la API:', result); // Verifica si `id` está presente en los objetos
            if (result.success) {
                const formattedData = result.data.map((item) => ({
                    ...item,
                    importe: parseFloat(item.importe) || 0,
                }));
                console.log('Datos formateados:', formattedData);
                setMiscelaneo(formattedData);
            }
        } catch (error) {
            console.error('Error al cargar misceláneo:', error);
        }
    };

    const handleOpenModal = () => {
        setNewItem({ nombre: '', importe: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChangeModal = (field, value) => {
        setNewItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveItem = async () => {
        if (!newItem.nombre || !newItem.importe) {
            alert("Debe completar todos los campos.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/miscelaneo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                fetchMiscelaneo();
                setIsModalOpen(false);
                alert('Item creado con éxito.');
            } else {
                throw new Error('Error al guardar el nuevo item.');
            }
        } catch (error) {
            console.error('Error creando item:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        if (id === undefined || id === null) {
            console.error("El ID es inválido:", id);
            return;
        }
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((itemId) => itemId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) {
            alert('Selecciona al menos un ítem para eliminar.');
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/miscelaneo`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedItems }), // Enviar los IDs seleccionados
            });

            if (response.ok) {
                alert('Ítem(s) eliminado(s) correctamente.');
                fetchMiscelaneo(); // Refrescar los datos tras la eliminación
                setSelectedItems([]); // Limpiar la selección de checkboxes
            } else {
                throw new Error('Error al eliminar los ítems.');
            }
        } catch (error) {
            console.error('Error eliminando ítems:', error);
            alert('Error al eliminar los ítems.');
        }
    };

    const handleEditMode = () => {
        setIsEditing(true);
        setEditedItems(miscelaneo.map((item) => ({ ...item })));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedItems([]);
    };

    const handleInputChange = (id, field, value) => {
        setEditedItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSaveChanges = async () => {
        try {
            // Iterar sobre los elementos editados y realizar la actualización para cada uno
            for (const item of editedItems) {
                const response = await fetch(`${baseURL}/api/miscelaneo/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: item.nombre,
                        importe: item.importe,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error al actualizar el ítem con ID ${item.id}`);
                }
            }

            fetchMiscelaneo(); // Actualizar la tabla tras los cambios
            setIsEditing(false); // Salir del modo de edición
            alert('Cambios guardados con éxito.');
        } catch (error) {
            console.error('Error guardando cambios:', error);
            alert('Error al guardar los cambios.');
        }
    };

    return (
        <div className="container">
            <h1 className="title">Misceláneo</h1>

            {isEditing ? (
                <>
                    <button className="button miscelaneo-button-guardar" onClick={handleSaveChanges}>
                        Guardar
                    </button>
                    <button className="button miscelaneo-button-cancelar" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <button className="button button-guardar" onClick={handleOpenModal}>
                        <TbCategoryPlus style={{ marginRight: '8px' }} />
                        Crear Ítem
                    </button>
                    <button className="button button-cancelar" onClick={handleEditMode}>
                        <MdEdit style={{ marginRight: '8px' }} />
                        Editar Ítem
                    </button>
                </>
            )}

            {isModalOpen && (
                <div className="miscelaneo-modal-overlay">
                    <div className="miscelaneo-modal-content">
                        <RxCross2
                            className="miscelaneo-modal-close-button"
                            onClick={handleCloseModal} // Cierra el modal al hacer clic en el botón de cerrar
                        />
                        <h2>Crear Nuevo Ítem</h2>
                        <div className="miscelaneo-modal-form">
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={newItem.nombre}
                                    onChange={(e) => handleInputChangeModal('nombre', e.target.value)}
                                />
                            </label>
                            <label>
                                Importe (€):
                                <input
                                    type="number"
                                    min={0}
                                    value={newItem.importe}
                                    onChange={(e) => handleInputChangeModal('importe', e.target.value)}
                                />
                            </label>
                            <button className="button button-guardar" onClick={handleSaveItem}>
                                Guardar
                            </button>
                            <button className="button button-cancelar" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className={`miscelaneo-table equipos-table ${isEditing ? 'editing' : ''}`}>
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
                        <th>Importe (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {(isEditing ? editedItems : miscelaneo).map((item) => (
                        <tr key={item.id}>
                            {!isEditing && (
                                <td>
                                    <div className="captcha-container">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(item.id)}
                                            checked={selectedItems.includes(item.id)}
                                        />
                                    </div>
                                </td>
                            )}
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedItems.find((i) => i.id === item.id)?.nombre || ''}
                                        onChange={(e) => handleInputChange(item.id, 'nombre', e.target.value)}
                                    />
                                ) : (
                                    item.nombre
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min={0}
                                        value={editedItems.find((i) => i.id === item.id)?.importe || ''}
                                        onChange={(e) => handleInputChange(item.id, 'importe', e.target.value)}
                                    />
                                ) : (
                                    `${typeof item.importe === 'number' ? item.importe.toFixed(2) : 'N/A'} €`
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Miscelaneo;
