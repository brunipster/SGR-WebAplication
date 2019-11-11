const express = require('express');
const router = express.Router();

const pool = require('../database');

const cuestionarioController = require('../classes/cuestionariosController');
const periodoController = require('../classes/periodoController');
const nivelGobiernoController = require('../classes/nivelGobiernoController');

// holatequiero

router.get('/', async (req, res) => {
    const cuestionarios = await cuestionarioController.getAll();
    res.render('cuestionario/lista', { cuestionarios });
})

router.get('/obtener/:id', async (req, res) => {
    const { id } = req.params
    const cuestionario = await cuestionarioController.get(id)
    res.send(cuestionario[0]);
})

router.get('/crear', async (req, res) => {
    let niveles = await nivelGobiernoController.getAll();
    let periodos = await periodoController.getAll();
    res.render('cuestionario/crear', { periodos, niveles });
})

router.post('/crear', async (req, res) => {
    const { descripcion, periodo, preguntas, nivel } = req.body;
    const cuestionario = { descripcion: descripcion, idPeriodo: parseInt(periodo), nivelGobierno: nivel, estado: true };
    await cuestionarioController.create(cuestionario, preguntas);
    req.flash('success', "Cuestionario creado satifactoriamente");
    res.send('ok');
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params

    let periodos = await periodoController.getAll();
    let niveles = await nivelGobiernoController.getAll();

    var cuestionario = await cuestionarioController.get(parseInt(id));
    console.log(cuestionario)
    res.render('cuestionario/editar', { cuestionario: cuestionario[0], periodos: periodos, niveles: niveles });
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion, periodo, nivel, preguntas } = req.body;
    const cuestionario = { descripcion: descripcion, idPeriodo: parseInt(periodo), nivelGobierno: nivel, estado: true };
    let listaRespuestas = preguntas.map(resp => {
        var respuesta = Object.assign({}, resp);
        return [0.0, respuesta.idPregunta, id];
    })
    cuestionarioController.update(cuestionario, id, listaRespuestas);
    req.flash('success', "Pregunta modificada satifactoriamente");
    res.send('ok');
});

router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    let respEliminarPeriodo = await cuestionarioController.delete(id);
    console.log(respEliminarPeriodo);
    res.send(id);
})


module.exports = router;