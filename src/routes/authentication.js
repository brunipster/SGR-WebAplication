const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const nivelGobiernoController = require('../classes/nivelGobiernoController');

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/perfil',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
});

router.get('/registro', isNotLoggedIn, async (req, res) => {
    let niveles = await nivelGobiernoController.getAll();
    res.render("auth/registro", { niveles });
})

router.post('/registro', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/perfil',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('perfil');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('login');
});

module.exports = router;