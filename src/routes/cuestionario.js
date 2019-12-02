const express = require('express');
const router = express.Router();

const pool = require('../database');

const cuestionarioController = require('../classes/cuestionariosController');
const periodoController = require('../classes/periodoController');
const nivelGobiernoController = require('../classes/nivelGobiernoController');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {

    if (req.user.rol == 'U') {
        const cuestionarios = await cuestionarioController.getByNivelGobierno(req.user.nivelGobierno);
        const usuarioCuestionarios = await cuestionarioController.getCuestionarioUsuario(req.user.id);
        cuestionarios.forEach(function (cue) {
            usuarioCuestionarios.forEach(function (usu) {
                if (cue.id == usu.idCuestionario) {
                    usu.porcentaje = ((usu.cantidadRespuestas / cue.cantidadPreguntas) * 100).toFixed(1)
                    cue.resuelto = usu
                }
            });
        });
        res.render('cuestionario/listaUsuario', { cuestionarios })
    } else {
        const cuestionarios = await cuestionarioController.getAll();
        res.render('cuestionario/lista', { cuestionarios })
    }

})

router.get('/obtenerCuestionario/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const { idRespuesta } = req.query
    const cuestionario = await cuestionarioController.get(id)
    if (idRespuesta > -1) {
        const respuestaCuestionario = await cuestionarioController.getCuestionarioRespuestas(idRespuesta);
        cuestionario[0].idRespuestaCuestionario = idRespuesta;
        cuestionario[0].preguntas.forEach(function (preg) {
            respuestaCuestionario.forEach(function (res) {
                if (preg.id == res.idPreguntaCuestionario) {
                    preg.idRespuesta = res.idRespuestaCuestionario
                }
            });
        });
    }
    console.log(cuestionario[0]);
    res.send(cuestionario[0]);
})

router.get('/obtener/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const cuestionario = await cuestionarioController.get(id)
    res.send(cuestionario[0]);
})

router.get('/crear', isLoggedIn, async (req, res) => {
    let niveles = await nivelGobiernoController.getAll();
    let periodos = await periodoController.getAll();
    res.render('cuestionario/crear', { periodos, niveles });
})

router.post('/crear', isLoggedIn, async (req, res) => {
    const { descripcion, periodo, preguntas, nivel } = req.body;
    const cuestionario = { descripcion: descripcion, idPeriodo: parseInt(periodo), nivelGobierno: nivel, estado: true };
    await cuestionarioController.create(cuestionario, preguntas);
    req.flash('success', "Cuestionario creado satifactoriamente");
    res.send('ok');
})

router.post('/crearUsuario', isLoggedIn, async (req, res) => {
    req.body.cuestionario.idUsuario = req.user.id
    const { idRespuestaCuestionario } = req.query
    let resCreateCuestionario = {}
    if (idRespuestaCuestionario.length > 0) {
        resCreateCuestionario = await cuestionarioController.updateCuestionarioUsuario(req.body.cuestionario, idRespuestaCuestionario);
        if (resCreateCuestionario.serverStatus == 2) {
            req.body.respuestas.forEach(element => {
                element.idUsuarioCuestionario = parseInt(idRespuestaCuestionario)
            });
            let respuestas = req.body.respuestas
            if (respuestas.length > 0) {
                let resCreatePreguntas = await cuestionarioController.createPreguntasResueltas(respuestas);
                if (resCreatePreguntas.serverStatus == 2) {
                    res.send({ 'result': 'ok' });
                }
            } else {
                res.send({ 'result': 'ok' });
            }

        }
    } else {
        resCreateCuestionario = await cuestionarioController.createCuestionarioUsuario(req.body.cuestionario);
        if (resCreateCuestionario.serverStatus == 2) {
            req.body.respuestas.forEach(element => {
                element.idUsuarioCuestionario = parseInt(resCreateCuestionario.insertId)
            });
            let respuestas = req.body.respuestas
            if (respuestas.length > 0) {
                let resCreatePreguntas = await cuestionarioController.createPreguntasResueltas(respuestas);
                if (resCreatePreguntas.serverStatus == 2) {
                    res.send({ 'result': 'ok' });
                }
            } else {
                res.send({ 'result': 'ok' });
            }
        }
    }
})

router.get('/editar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params

    let periodos = await periodoController.getAll();
    let niveles = await nivelGobiernoController.getAll();

    var cuestionario = await cuestionarioController.get(parseInt(id));
    console.log(cuestionario)
    res.render('cuestionario/editar', { cuestionario: cuestionario[0], periodos: periodos, niveles: niveles });
});

router.post('/editar/:id', isLoggedIn, async (req, res) => {
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

router.delete('/eliminar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let respEliminarPeriodo = await cuestionarioController.delete(id);
    console.log(respEliminarPeriodo);
    res.send(id);
})


module.exports = router;