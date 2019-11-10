const express = require('express');
const router = express.Router();

const pool = require('../database');

const preguntaController = require('../classes/preguntaController');
const periodoController = require('../classes/periodoController');

// holatequiero

router.get('/', async (req, res) => {
    const preguntas = await preguntaController.getAll();
    res.render('preguntas/lista', { preguntas });
})

router.get('/crear', async (req, res) => {
    let periodos = await periodoController.getAll();
    res.render('preguntas/crear', { periodos });
})

router.post('/crear', async (req, res) => {
    const { descripcion, periodo, respuestas } = req.body;

    const pregunta = { descripcion: descripcion, idPeriodo: parseInt(periodo) };

    await preguntaController.create(pregunta, respuestas);

    req.flash('success', "Pregunta creada satifactoriamente");
    res.send('ok');
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params

    let periodos = await periodoController.getAll();

    var pregunta = await preguntaController.get(parseInt(id));

    var body = {
        descPregunta: pregunta[0].descPregunta,
        valor: pregunta[0].valor,
        id: pregunta[0].idPregunta,
        respuestas: pregunta
    }
    res.render('preguntas/editar', { pregunta: body, periodos: periodos });
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion, periodo, respuestas } = req.body;
    const pregunta = { descripcion: descripcion, idPeriodo: periodo };
    let listaRespuestas = respuestas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [respuesta.descripcion, respuesta.valor, id];
    })
    preguntaController.update(pregunta, id, listaRespuestas);
    req.flash('success', "Pregunta modificada satifactoriamente");
    res.send('ok');
});

router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    preguntaController.delete(id);
    req.flash('success', "Pregunta removida satisfactoriamente");
    res.redirect('/preguntas');
})


module.exports = router;