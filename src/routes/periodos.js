const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../database');
const helpers = require('../lib/helpers');
const periodoController = require('../classes/periodoController');

router.get('/', async (req, res) => {
    const periodos = await pool.query('SELECT * FROM `Periodo`');
    res.render('periodos', { periodos });
})

router.get('/obtener/:id', async (req, res) => {
    const { id } = req.params
    const periodo = await periodoController.get(id);
    if (periodo.length > 0) {
        const obj = periodo[0];
        obj.fechaInicio = helpers.formatDateSqlToJs(obj.fechaInicio);
        obj.fechaFin = helpers.formatDateSqlToJs(obj.fechafin);
        res.send(obj);
    } else {
        res.send({});
    }
})

router.post('/crear', async (req, res) => {
    const body = req.body;
    console.log(helpers.formatDateJsToSql(body.fechaInicio));
    body.fechaInicio = helpers.formatDateJsToSql(body.fechaInicio);
    body.fechaFin = helpers.formatDateJsToSql(body.fechaFin);
    let respInsertPeriodo = await periodoController.create(body);
    res.send(body);
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params
    const body = req.body;
    body.fechaInicio = helpers.formatDateJsToSql(body.fechaInicio);
    body.fechaFin = helpers.formatDateJsToSql(body.fechaFin);
    let respUpdatePeriodo = await periodoController.update(body, id);
    res.send(body);
});

router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params
    let respEliminarPeriodo = await periodoController.delete(id)
    console.log(respEliminarPeriodo);
    res.send(id);
});

module.exports = router;