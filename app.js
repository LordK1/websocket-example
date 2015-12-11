require('./model/db');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var passport = require('passport');
require('./config/passport');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var app = express();
app.set('port', (process.env.PORT || 3000));
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./socketio')(server, io, mongoStore);

server.listen(app.get('port'), function () {
    console.log('Server is running on http://0.0.0.0:%d', app.get('port'));
});

// serve statics as express statics
app.use('/bower_components', express.static('bower_components'));
app.use('/static', express.static('public'));

/**
 * View and Template Engine
 */
// view engine setup
app.set('views', 'views');
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(logger('dev'));
app.use(flash());

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
        url: config.url
    })
}));

app.use(passport.initialize());
app.use(passport.session());


/**
 * App Routes
 * */
var routes = require('./routes/index');
app.use('/', routes);
var auth = require('./routes/auth');
app.use('/', auth);

var api = require('./routes/api');
app.use('/', api);
