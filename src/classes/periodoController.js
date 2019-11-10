const pool = require('../database');

const controller = {};

controller.getAll = async () => {
    const periodos = await pool.query('SELECT * FROM Periodo');
    return periodos;
};

controller.get = async (id) => {
    const periodo = await pool.query('SELECT * FROM Periodo WHERE id=?', [id]);
    periodo[0].preguntas = await pool.query('SELECT * FROM Pregunta WHERE idPeriodo =?', [id]);
    console.log(periodo);
    return periodo;
}

controller.create = async (periodo) => {
    let respInsertPeriodo = await pool.query('INSERT INTO Periodo set ?', [periodo]);
    console.log(respInsertPeriodo);
}

controller.update = async (periodo, id) => {
    let respUpdatePeriodo = await pool.query('UPDATE Periodo set ? WHERE id=?', [periodo, id]);
    console.log(respUpdatePeriodo);
}

controller.delete = async (id) => {
    let respDeletePeriodo = await pool.query('DELETE FROM Periodo WHERE id=?', [id]);
    console.log(respDeletePeriodo);
}

module.exports = controller