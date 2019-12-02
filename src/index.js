const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqltore = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');
const Watson = require("watson-developer-cloud/assistant/v2");
const watson = require('watson-developer-cloud');
const Cred = require("./ibm-credentials.json");
const botConf = require("./botConfig.json");
// Inicializar
const app = express();
require('./lib/passport')


var Sess_ID;
var Res;

// Initialising Watson Assisstant

const Ass = new Watson({
    version: '2018-11-08',
    username: 'Put Your Watson Login Username',
    password: 'Put Your Watson Login Password',
    url: Cred.URL
}, (err, res) => {
    console.log(err);
    console.log(res);
});

const service = new watson.AssistantV2({
    iam_apikey: Cred.API, //Put Your API key from the credential JSON file we created earlier
    version: '2018-11-08',
    url: Cred.URL //Put your Url From that credentials JSON file we created earlier
});



// Config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}));
app.set('view engine', '.hbs');

// Middleware
app.use(session({
    secret: 'sgrsecret',
    resave: false,
    saveUninitialized: false,
    store: new mysqltore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session())

//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

// Routes
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/preguntas', require('./routes/preguntas'));
app.use('/cuestionario', require('./routes/cuestionario'));
app.use('/periodos', require('./routes/periodos'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})