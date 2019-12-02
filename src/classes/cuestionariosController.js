const pool = require('../database');

const controller = {};

controller.getAll = async () => {
    const cuestionarios = await pool.query('SELECT cue.*, nvl.descripcion as nivelDescripcion , (select count(*) from preguntas_cuestionario where idCuestionario = cue.id) as cantidadPreguntas FROM cuestionario as cue inner join nivelGobierno as nvl on cue.nivelGobierno = nvl.id');
    return cuestionarios
};

controller.get = async (id) => {
    const responseCuestionario = await pool.query(
        'SELECT * FROM cuestionario' +
        ' WHERE id = ?', [parseInt(id)]);

    responseCuestionario[0].preguntas = JSON.parse(JSON.stringify(await pool.query('SELECT pc.id, pc.idPregunta, pc.idCuestionario, pre.idPeriodo, pre.descripcion' +
        ' FROM preguntas_cuestionario as pc left join pregunta pre on pc.idPregunta = pre.id where pc.idCuestionario = ?', [parseInt(id)])));

    let respuestas = JSON.parse(JSON.stringify(await pool.query('SELECT res.* FROM respuesta res ' +
        'inner join pregunta pre on res.idPregunta = pre.id ' +
        'inner join preguntas_cuestionario as pc on pc.idPregunta = pre.id ' +
        'where pc.idCuestionario = ?', [parseInt(id)])))
    responseCuestionario[0].preguntas.forEach(element => {
        element.respuestas = []
        respuestas.forEach(elm => {
            if (elm.idPregunta == element.idPregunta) {
                element.respuestas.push(elm);
            }
        });
    });
    return JSON.parse(JSON.stringify(responseCuestionario));
};

controller.getByNivelGobierno = async (nivel) => {
    const cuestionarios = await pool.query('SELECT cue.*, nvl.descripcion as nivelDescripcion , per.descripcion as periodoDescripcion,(select count(*) from preguntas_cuestionario where idCuestionario = cue.id) as cantidadPreguntas FROM cuestionario as cue inner join nivelGobierno as nvl on cue.nivelGobierno = nvl.id inner join periodo as per on cue.idPeriodo = per.id where cue.nivelGobierno = ?', [nivel]);
    return JSON.parse(JSON.stringify(cuestionarios))
};

controller.create = async (cuestionario, preguntas) => {
    let respInsertCuestionario = await pool.query('INSERT INTO Cuestionario set ?', [cuestionario]);
    let idCuestionario = respInsertCuestionario.insertId;

    let listaPreguntas = preguntas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [0.0, respuesta.idPregunta, idCuestionario];
    })
    let respInsertRespuesta = await pool.query('INSERT INTO Preguntas_Cuestionario (valor, idPregunta, idCuestionario) VALUES ?', [listaPreguntas]);
};

controller.createCuestionarioUsuario = async (cuestionario) => {
    let respInsertCuestionario = await pool.query('INSERT INTO usuario_cuestionario set ?', [cuestionario]);
    return JSON.parse(JSON.stringify(respInsertCuestionario))
};

controller.updateCuestionarioUsuario = async (cuestionario, id) => {
    let respInsertCuestionario = await pool.query('UPDATE usuario_cuestionario set ? where id = ?', [cuestionario, id]);
    await pool.query('DELETE FROM preguntas_resueltas where idUsuarioCuestionario = ?', [id]);
    return JSON.parse(JSON.stringify(respInsertCuestionario))
};


controller.getCuestionarioUsuario = async (idUsuario) => {
    let respInsertCuestionario = await pool.query('SELECT uc.*, (select count(*) from preguntas_resueltas where idUsuarioCuestionario = uc.id) as cantidadRespuestas FROM usuario_cuestionario as uc where uc.idUsuario = ?', [idUsuario]);
    return JSON.parse(JSON.stringify(respInsertCuestionario))
};

controller.getCuestionarioRespuestas = async (idUsuarioCuestionario) => {
    let respInsertCuestionario = await pool.query('SELECT * FROM `preguntas_resueltas` where `idUsuarioCuestionario` = ?', [idUsuarioCuestionario]);
    return JSON.parse(JSON.stringify(respInsertCuestionario))
};

controller.createPreguntasResueltas = async (preguntas) => {
    let listaPreguntas = preguntas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [respuesta.respuestaDetalle, respuesta.preguntaDetalle, respuesta.idUsuarioCuestionario, respuesta.idRespuestaCuestionario, respuesta.idPreguntaCuestionario];
    })
    let respInsertRespuesta = await pool.query('INSERT INTO preguntas_resueltas (respuestaDetalle, preguntaDetalle, idUsuarioCuestionario, idRespuestaCuestionario,idPreguntaCuestionario) VALUES ?', [listaPreguntas]);
    return JSON.parse(JSON.stringify(respInsertRespuesta))
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