const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/registro', (req, res) => {
    res.render("auth/registro");
})

router.post('/registro', passport.authenticate('local.signup', {
    successRedirect: '/perfil',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/perfil', (req, res) => {
    req.send('this is your profile')
});

module.exports = router;