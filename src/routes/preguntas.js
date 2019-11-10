const express = require('express');
const router = express.Router();

const pool = require('../database');

// holatequiero

router.get('/', async (req,res) =>{
    const preguntas = await pool.query('SELECT pre.id, pre.descripcion,per.descripcion as periodo ,COUNT(re.id) as cantidadRespuestas FROM Pregunta pre inner join Respuesta re on pre.id = re.idPregunta inner join Periodo per on pre.idPeriodo = per.id GROUP by (pre.id)');
    res.render('preguntas/lista', {preguntas});
})

router.get('/crear', async(req,res) => {
    const periodos = await pool.query('SELECT * FROM Periodo');
    res.render('preguntas/crear', {periodos});
})

router.post('/crear', async(req,res) => {
    const {descripcion, periodo, respuestas} = req.body;
    const pregunta = {descripcion : descripcion, idPeriodo: parseInt(periodo)};
    let respInsertPregunta = await pool.query('INSERT INTO Pregunta set ?', [pregunta]);

    let idPregunta = respInsertPregunta.insertId;
    let listaRespuestas = respuestas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [respuesta.descripcion, respuesta.valor, idPregunta];
    })
    await pool.query('INSERT INTO Respuesta (descripcion, valor, idPregunta) VALUES ?', [listaRespuestas]);

    req.flash('success', "Pregunta creada satifactoriamente");
    res.send('ok');
})

router.get('/editar/:id', async(req,res) => {
    const {id} = req.params

    const periodos = await pool.query('SELECT * FROM Periodo');

    const responsePregunta =  await pool.query(
    'SELECT pre.id as idPregunta, pre.descripcion as descPregunta, re.id, re.descripcion, re.valor, re.id as respuestaId '+
    'FROM Pregunta pre inner join Respuesta re on pre.id = re.idPregunta'+
    ' WHERE pre.id = ?', [parseInt(id)]);
    
    var pregunta  = JSON.parse(JSON.stringify(responsePregunta));
    var body = {
        descPregunta: pregunta[0].descPregunta,
        valor: pregunta[0].valor,
        id: pregunta[0].idPregunta,
        respuestas: pregunta
    }
    res.render('preguntas/editar', {pregunta: body,periodos:periodos });
});

router.post('/editar/:id', async(req,res) => {
    const { id } = req.params;
    const {descripcion, periodo, respuestas} = req.body;
    const pregunta = {descripcion : descripcion, idPeriodo: periodo};
    console.log(req.body);
    let respUpdatePregunta = await pool.query('UPDATE Pregunta set ? where id=?', [pregunta, id]);
    
    await pool.query('DELETE FROM Respuesta where idPregunta = ?', [id]);

    let listaRespuestas = respuestas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [respuesta.descripcion, respuesta.valor, id];
    })
    await pool.query('INSERT INTO Respuesta (descripcion, valor, idPregunta) VALUES ?', [listaRespuestas]);
    req.flash('success', "Pregunta modificada satifactoriamente");
    res.send('ok');
});

router.get('/eliminar/:id', async(req,res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM Respuesta where idPregunta = ?', [id]);
    await pool.query('DELETE FROM Pregunta WHERE ID = ?', [id]);
    req.flash('success', "Pregunta removida satisfactoriamente");
    res.redirect('/preguntas');
})


module.exports = router;