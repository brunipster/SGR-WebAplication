const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
    usernamefield: 'usuario',
    passwordfield: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { nombreCompleto } = req.body;
    const newUser = {
        usuario: username,
        password: password,
        nombreCompleto: nombreCompleto
    }
    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    return done(null, newUser);
}))

// passport.serializeUser((use, done) => {

// })