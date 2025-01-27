import React, { useEffect, useState } from 'react';
import './Categorias.css';
import { baseURL } from '../../../components/login/Login';
import { TbCategoryPlus } from "react-icons/tb";
import { MdBookmarkRemove, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [initialSubcategoryNames, setInitialSubcategoryNames] = useState({});
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategorias, setEditedCategorias] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoria, setNewCategoria] = useState({
        nombre: '',
        padre: '',
    });
    const [tipoSeleccionado, setTipoSeleccionado] = useState(""); // Nuevo estado
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(""); // Para el segundo dropdown (ESCOLAR)

    const handleOpenModal = () => {
        setNewCategoria({ nombre: '', padre: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChangeModal = (field, value) => {
        setNewCategoria((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveCategoria = () => {
        // Determinar el valor del campo "padre"
        let padreValue = null;
        if (tipoSeleccionado === "FEDERADO") {
            padreValue = 37; // Valor fijo para FEDERADO
        } else if (tipoSeleccionado === "ESCOLAR" && subcategoriaSeleccionada) {
            padreValue = parseInt(subcategoriaSeleccionada); // Valor de la subcategoría seleccionada
        }

        if (!newCategoria.nombre || !padreValue) {
            alert("Debe completar todos los campos antes de guardar.");
            return;
        }

        // Guardar en la base de datos
        fetch(`${baseURL}/api/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...newCategoria, padre: padreValue }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al guardar la nueva categoría.');
                }
            })
            .then((savedCategoria) => {
                // Actualiza la tabla directamente
                fetch(`${baseURL}/api/categorias`)
                    .then((response) => response.json())
                    .then((data) => {
                        setCategorias(data); // Reemplaza las categorías con los datos más recientes
                    })
                    .catch((error) =>
                        console.error('Error al actualizar la tabla después de crear:', error)
                    );

                setIsModalOpen(false);
                alert('Categoría creada con éxito.');
            })
            .catch((error) => console.error('Error creando categoría:', error));
    };

    const handleCheckboxChange = (id) => {
        setSelectedCategorias((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((categoriaId) => categoriaId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedCategorias.length === 0) {
            alert('Selecciona al menos una categoría para eliminar.');
            return;
        }

        fetch(`${baseURL}/api/categorias`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedCategorias }),
        })
            .then((response) => {
                if (response.ok) {
                    setCategorias((prevCategorias) =>
                        prevCategorias.filter((categoria) => !selectedCategorias.includes(categoria.id))
                    );
                    setSelectedCategorias([]);
                    alert('Categoría(s) eliminada(s) correctamente.'); // Mensaje de éxito
                } else {
                    alert('Error al eliminar las categorías.');
                }
            })
            .catch((error) => {
                console.error('Error eliminando categorías:', error);
            });
    };

    const handleEditMode = () => {
        setIsEditing(true);
        setEditedCategorias([...categorias]);

        // Cargar subcategorías de los elementos ESCOLARES
        categorias.forEach((categoria) => {
            if (categoria.categoria_raiz === "ESCOLAR") {
                fetchSubcategorias(36); // ID del nodo raíz de ESCOLARES
            }
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedCategorias([]);
    };

    const handleInputChange = (id, field, value) => {
        setEditedCategorias((prevCategorias) =>
            prevCategorias.map((categoria) =>
                categoria.id === id ? { ...categoria, [field]: value } : categoria
            )
        );
    };

    const handleSaveChanges = () => {
        console.log("Datos a guardar:", editedCategorias);

        const updatedCategorias = editedCategorias.filter((edited) => {
            const original = categorias.find((cat) => cat.id === edited.id);
            return (
                original &&
                (original.nombre !== edited.nombre ||
                    original.padre !== edited.padre ||
                    original.categoria_raiz !== edited.categoria_raiz)
            );
        });

        if (updatedCategorias.length === 0) {
            alert('No hay cambios para guardar.');
            setIsEditing(false);
            return;
        }

        fetch(`${baseURL}/api/categorias`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategorias),
        })
            .then((response) => {
                if (response.ok) {
                    setCategorias(editedCategorias); // Actualiza el estado principal
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


    const handleDropdownChange = (id, field, value) => {
        setEditedCategorias((prevCategorias) =>
            prevCategorias.map((categoria) => {
                if (categoria.id === id) {
                    const updated = { ...categoria, [field]: value };

                    if (field === "categoria_raiz" && value === "ESCOLAR") {
                        fetchSubcategorias(36); // ID del nodo raíz de ESCOLAR
                    }

                    return updated;
                }
                return categoria;
            })
        );
    };

    const handleSubcategoriaChange = (id, value) => {
        setEditedCategorias((prevCategorias) => {
            const updatedCategorias = prevCategorias.map((categoria) =>
                categoria.id === id ? { ...categoria, padre: value } : categoria
            );
            console.log("Categorías actualizadas tras seleccionar en el dropdown:", updatedCategorias);
            return updatedCategorias;
        });
    };
    
    const fetchSubcategorias = async (padreId) => {
        try {
            const response = await fetch(`${baseURL}/api/categorias/subcategorias/${padreId}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Subcategorías cargadas:", data); // Verificar subcategorías
                setSubcategorias(data);
            } else {
                console.error("Error al cargar subcategorías.");
            }
        } catch (error) {
            console.error("Error al cargar subcategorías:", error);
        }
    };

    const fetchInitialSubcategoryName = async (id) => {
        try {
            const response = await fetch(`${baseURL}/api/categorias/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`Respuesta del backend para ID ${id}:`, data); // Verifica la respuesta
                return data.nombre_padre || "Sin padre";
            } else {
                console.error(`Error en la respuesta del servidor para ID ${id}`);
            }
        } catch (error) {
            console.error(`Error al obtener el nombre del padre para ID ${id}:`, error);
        }
        return "Sin padre";
    };

    useEffect(() => {
        if (isModalOpen && tipoSeleccionado === "ESCOLAR") {
            fetchSubcategorias(36); // ID raíz de ESCOLAR
        }
    }, [isModalOpen, tipoSeleccionado]);

    useEffect(() => {
        fetch(`${baseURL}/api/categorias`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Datos de categorías recibidos:", data); // Verificar que nombre_padre llega
                setCategorias(data);
            })
            .catch((error) => console.error('Error al cargar categorías:', error));
    }, []);
    
    useEffect(() => {
        if (isEditing) {
            const escolarCategorias = categorias.filter(
                (categoria) => categoria.categoria_raiz === "ESCOLAR"
            );
            if (escolarCategorias.length > 0) {
                fetchSubcategorias(36); // Cargar las subcategorías relacionadas
            }
        }
    }, [isEditing, categorias]);

    useEffect(() => {
        const fetchParentNames = async () => {
            const initialNameMap = {};
            for (const categoria of categorias) {
                console.log(`Procesando categoría con ID: ${categoria.id}, Padre: ${categoria.padre}`);
                if (categoria.padre) {
                    try {
                        const initialName = await fetchInitialSubcategoryName(categoria.padre);
                        console.log(`Nombre encontrado para ID ${categoria.padre}:`, initialName);
                        initialNameMap[categoria.id] = initialName || "Sin padre";
                    } catch (error) {
                        console.error(`Error al obtener el nombre del padre para ID ${categoria.padre}:`, error);
                        initialNameMap[categoria.id] = "Sin padre";
                    }
                } else {
                    console.log(`La categoría con ID ${categoria.id} no tiene padre.`);
                    initialNameMap[categoria.id] = "Sin padre";
                }
            }
            console.log("Mapa de nombres inicial cargado:", initialNameMap);
            setInitialSubcategoryNames(initialNameMap);
        };

        if (categorias.length > 0) {
            fetchParentNames();
        }
    }, [categorias]);

    useEffect(() => {
        console.log("Mapa de nombres de padres (initialSubcategoryNames):", initialSubcategoryNames);
    }, [initialSubcategoryNames]);

    return (
        <div className="container">
            <h1 className="title">Listado de Categorías</h1>

            {isEditing ? (
                <>
                    <button className="button categoria-button-guardar" onClick={handleSaveChanges}>
                        Guardar
                    </button>
                    <button className="button categoria-button-cancelar" onClick={handleCancelEdit}>
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <button className="button button-guardar" onClick={handleOpenModal}>
                        <TbCategoryPlus style={{ marginRight: '8px' }} />
                        Crear Categoría
                    </button>
                    <button className="button button-cancelar" onClick={handleEditMode}>
                        <MdEdit style={{ marginRight: '8px' }} />
                        Editar Categoría
                    </button>
                </>
            )}

            {isModalOpen && (
                <div className="categorias-modal-overlay">
                    <div className="categorias-modal-content">
                        <RxCross2 className="categorias-modal-close-button" onClick={handleCloseModal} />
                        <h2>Crear Nueva Categoría</h2>
                        <div className="categorias-modal-form">
                            {/* Nombre de la categoría */}
                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                Nombre:
                                <input
                                    type="text"
                                    value={newCategoria.nombre}
                                    onChange={(e) => handleInputChangeModal('nombre', e.target.value)}
                                    style={{
                                        marginLeft: '10px',
                                        flex: 1, // Para que el input ocupe el espacio necesario
                                        padding: '8px', // Opcional: para mejor apariencia
                                    }}
                                />
                            </label>

                            {/* Primer dropdown: Tipo */}
                            <label style={{ display: 'block', marginBottom: '10px' }}>
                                Tipo:
                                <select
                                    value={tipoSeleccionado}
                                    onChange={(e) => setTipoSeleccionado(e.target.value)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="FEDERADO">FEDERADO</option>
                                    <option value="ESCOLAR">ESCOLAR</option> 
                                </select>
                            </label>

                            {/* Segundo dropdown: Subcategorías de ESCOLAR */}
                            {tipoSeleccionado === "ESCOLAR" && (
                                <label style={{ display: 'block', marginBottom: '10px' }}>
                                    Subcategoría:
                                    <select
                                        value={subcategoriaSeleccionada}
                                        onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value="">Seleccione una subcategoría</option>
                                        {subcategorias.map((subcategoria) => (
                                            <option key={subcategoria.id} value={subcategoria.id}>
                                                {subcategoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {/* Botón para guardar */}
                            <button className="button button-guardar" onClick={handleSaveCategoria}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className={`categorias-table ${isEditing ? 'editing' : ''}`}>
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
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
                {(isEditing ? editedCategorias : categorias).map((categoria) => (
                    <tr key={categoria.id}>
                        {!isEditing && (
                            <td>
                                <div className="captcha-container">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(categoria.id)}
                                        checked={selectedCategorias.includes(categoria.id)}
                                    />
                                </div>
                            </td>
                        )}
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={categoria.nombre}
                                    onChange={(e) =>
                                        handleInputChange(categoria.id, 'nombre', e.target.value)
                                    }
                                />
                            ) : (
                                categoria.nombre
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <>
                                    {/* Primer Dropdown: Categoría Raíz */}
                                    <select
                                        value={editedCategorias.find((cat) => cat.id === categoria.id)?.categoria_raiz || categoria.categoria_raiz || ""}
                                        onChange={(e) =>
                                            handleDropdownChange(categoria.id, "categoria_raiz", e.target.value)
                                        }
                                    >
                                        <option value="FEDERADO">FEDERADO</option>
                                        <option value="ESCOLAR">ESCOLAR</option>
                                    </select>

                                    {/* Segundo Dropdown: Subcategorías */}
                                    {categoria.categoria_raiz === "ESCOLAR" && (
                                        <select
                                            value={
                                                editedCategorias.find((cat) => cat.id === categoria.id)?.padre || categoria.padre || "Sin padre"
                                            } // Mostrar el valor actualizado
                                            style={{ marginLeft: '6px' }}
                                            onChange={(e) => handleSubcategoriaChange(categoria.id, parseInt(e.target.value))}
                                        >
                                            {/* Opciones disponibles */}
                                            {subcategorias.map((subcategoria) => (
                                                <option key={subcategoria.id} value={subcategoria.id}>
                                                    {subcategoria.nombre}
                                                </option>
                                            ))}
                                        </select>

                                    )}
                                </>
                            ) : (
                                <div>
                                    {categoria.categoria_raiz === "ESCOLAR"
                                        ? "ESCOLAR"
                                        : categoria.categoria_raiz === "FEDERADO"
                                            ? "FEDERADO"
                                            : "Sin categoría"}
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div >
    );
};

export default Categorias;