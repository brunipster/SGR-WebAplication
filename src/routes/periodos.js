const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req,res) =>{
    const periodos = await pool.query('SELECT * FROM `Periodo`');
    res.render('periodos', {periodos});
})

router.get('/obtener/:id', async (req,res) =>{
    const {id} = req.params
    const periodo = await pool.query('SELECT * FROM `Periodo` where id=?', [id]);
    res.send(periodo);
})

module.exports = router;