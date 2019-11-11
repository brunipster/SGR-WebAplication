const pool = require('../database');

const controller = {};

controller.getAll = async () => {
    const cuestionarios = await pool.query('SELECT * FROM cuestionario');
    return cuestionarios
};

controller.get = async (id) => {
    const responseCuestionario = await pool.query(
        'SELECT * FROM cuestionario' +
        ' WHERE id = ?', [parseInt(id)]);

    responseCuestionario[0].preguntas = await pool.query('SELECT pc.id, pc.idPregunta, pc.idCuestionario, pre.idPeriodo, pre.descripcion' +
        ' FROM preguntas_cuestionario as pc left join pregunta pre on pc.idPregunta = pre.id where pc.idCuestionario = ?', [parseInt(id)]);
    return JSON.parse(JSON.stringify(responseCuestionario));
};

controller.create = async (cuestionario, preguntas) => {
    let respInsertCuestionario = await pool.query('INSERT INTO Cuestionario set ?', [cuestionario]);
    let idCuestionario = respInsertCuestionario.insertId;

    let listaPreguntas = preguntas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [0.0, respuesta.idPregunta, idCuestionario];
    })
    console.log(listaPreguntas)
    let respInsertRespuesta = await pool.query('INSERT INTO Preguntas_Cuestionario (valor, idPregunta, idCuestionario) VALUES ?', [listaPreguntas]);
    console.log(respInsertRespuesta);
};

controller.update = async (cuestionario, id, listaPreguntas) => {
    await pool.query('UPDATE Cuestionario set ? where id=?', [cuestionario, id]);
    await pool.query('DELETE FROM Preguntas_Cuestionario where idCuestionario = ?', [id]);
    await pool.query('INSERT INTO Preguntas_Cuestionario (valor, idPregunta, idCuestionario) VALUES ?', [listaPreguntas]);
}

controller.delete = async (id) => {
    await pool.query('DELETE FROM Preguntas_Cuestionario where idCuestionario = ?', [id]);
    await pool.query('DELETE FROM Cuestionario WHERE ID = ?', [id]);
};

module.exports = controller