const db = require('./db_setup');

async function getCategoriaId(nombre) {
    console.log("Buscando categoría en la base de datos:", nombre);
    const normalizedNombre = nombre.trim().toLowerCase();
    const [rows] = await db.query("SELECT id FROM categorias WHERE LOWER(TRIM(nombre)) = ?", [normalizedNombre]);
    if (rows.length === 0) throw new Error(`Categoría no encontrada: ${nombre}`);
    return rows[0].id;
}

async function getEquipoId(nombre, categoriaId) {
    const [rows] = await db.query("SELECT id FROM equipos WHERE nombre = ? AND categoria_id = ?", [nombre, categoriaId]);
    if (rows.length === 0) throw new Error(`Equipo no encontrado: ${nombre}`);
    return rows[0].id;
}

async function getCampoId(nombre) {
    const [rows] = await db.query("SELECT id FROM campos WHERE nombre = ?", [nombre]);
    if (rows.length === 0) throw new Error(`Campo no encontrado: ${nombre}`);
    return rows[0].id;
}

async function getArbitroId(alias) {
    const [rows] = await db.query("SELECT id FROM arbitros WHERE alias = ?", [alias]);
    if (rows.length === 0) throw new Error(`Árbitro no encontrado: ${alias}`);
    return rows[0].id;
}

module.exports = {
    getCategoriaId,
    getEquipoId,
    getCampoId,
    getArbitroId,
};
