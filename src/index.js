const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqltore = require('express-mysql-session');
const moment = require('moment');
const {database} = require('./keys');  
// Inicializar
const app = express();

// Config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join( app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}));
app.set('view engine', '.hbs');

// Middleware
app.use(session({
    secret: 'pruebasecret',
    resave: false,
    saveUninitialized: false,
    store: new mysqltore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Global Variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    next();
})

// Routes
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/preguntas',require('./routes/preguntas'));
app.use('/cuestionario',require('./routes/cuestionarios'));
app.use('/periodos',require('./routes/periodos'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar server
app.listen(app.get('port'),() => {
    console.log('Server on port', app.get('port'))
})