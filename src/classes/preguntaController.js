const pool = require('../database');

const controller = {};

controller.getAll = async () => {
    const preguntas = await pool.query('SELECT pre.id, pre.descripcion,per.descripcion as periodo ,COUNT(re.id) as cantidadRespuestas FROM Pregunta pre inner join Respuesta re on pre.id = re.idPregunta inner join Periodo per on pre.idPeriodo = per.id GROUP by (pre.id)');
    return preguntas
};

controller.get = async (id) => {
    const responsePregunta = await pool.query(
        'SELECT pre.id as idPregunta, pre.descripcion as descPregunta, re.id, re.descripcion, re.valor, re.id as respuestaId ' +
        'FROM Pregunta pre inner join Respuesta re on pre.id = re.idPregunta' +
        ' WHERE pre.id = ?', [parseInt(id)]);

    return JSON.parse(JSON.stringify(responsePregunta));
};

controller.create = async (pregunta, respuestas) => {
    let respInsertPregunta = await pool.query('INSERT INTO Pregunta set ?', [pregunta]);
    let idPregunta = respInsertPregunta.insertId;

    let listaRespuestas = respuestas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [respuesta.descripcion, respuesta.valor, idPregunta];
    })
    let respInsertRespuesta = await pool.query('INSERT INTO Respuesta (descripcion, valor, idPregunta) VALUES ?', [listaRespuestas]);
    console.log(respInsertRespuesta);
};

controller.update = async (pregunta, id, listaRespuestas) => {
    await pool.query('UPDATE Pregunta set ? where id=?', [pregunta, id]);
    await pool.query('DELETE FROM Respuesta where idPregunta = ?', [id]);
    await pool.query('INSERT INTO Respuesta (descripcion, valor, idPregunta) VALUES ?', [listaRespuestas]);
};

controller.delete = async (id) => {
    await pool.query('DELETE FROM Respuesta where idPregunta = ?', [id]);
    await pool.query('DELETE FROM Pregunta WHERE ID = ?', [id]);
};

module.exports = controller