const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const rows = await pool.query('select * from usuario where usuario = ?', username);
    console.log(rows);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome' + user.usuario));
        } else {
            done(null, false, req.flash('message', 'Incorrect password'));
        }
    } else {
        return done(null, false, req.flash('message', 'Username doesnt exist'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernamefield: 'usuario',
    passwordfield: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log("Registro");
    console.log(req.body);
    const { nombreEntidad, nivelGobierno, rol } = req.body;
    const newUser = {
        usuario: username,
        password: password,
        nombreEntidad: nombreEntidad,
        nombre: nombreEntidad,
        nivelGobierno: nivelGobierno,
        rol: rol
    }
    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO Usuario SET ?', [newUser])
    console.log("Result");
    console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser);
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM Usuario where id = ?', [id]);
    done(null, rows[0]);
});