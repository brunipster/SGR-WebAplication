const pool = require('../database');

const controller = {}

controller.getAll = async () => {
    const niveles = await pool.query('SELECT * FROM NivelGobierno');
    return niveles
};

controller.get = async (id) => {
    const nivel = await pool.query('SELECT * FROM NivelGobierno WHERE id = ?', [id]);
    return nivel
}

module.exports = controller


