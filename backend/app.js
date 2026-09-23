var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');           // <-- agregar
require('dotenv').config();             // <-- agregar (carga variables .env)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var routeClientes = require('./routes/routeClientes');     // <-- agregar
var routeProductos = require('./routes/routeProductos');   // <-- agregar
var routeVentas = require('./routes/routeVentas');         // <-- agregar

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());                        // <-- agregar (antes de las rutas)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clientes', routeClientes);    // <-- agregar
app.use('/productos', routeProductos);  // <-- agregar
app.use('/ventas', routeVentas);        // <-- agregar

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;