require('./model/db');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var app = express();
app.set('port', (process.env.PORT || 3000));
var server = require('http').Server(app);
var io = require('socket.io')(server);


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
app.use(require('express-session')({
    secret: 'socketerapplication',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var User = require('./model/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * App Routes
 * */
var routes = require('./routes/index');
app.use('/', routes);
var auth = require('./routes/auth');
app.use('/', auth);
var api = require('./routes/api');
app.use('/', api);

/**
 * App Socket statics
 */
var listOfMessages = [{
    userId: 1,
    messageId: 10,
    userName: "Asha Greyjoy",
    content: {
        text: "The stone tree of the Stonetrees.",
        link: "http://awoiaf.westeros.org/index.php/House_Stonetree"
    },
    likedBy: [1],
    ts: Date.now() - 10000
}, {
    userId: 2,
    messageId: 11,
    userName: "Arya Stark",
    content: {
        text: "We'll come see this inn.",
        link: "http://gameofthrones.wikia.com/wiki/Inn_at_the_Crossroads"
    },
    likedBy: [2, 3],
    ts: Date.now() - 100000
}, {
    userId: 3,
    messageId: 14,
    userName: "Cersei Lannister",
    content: {
        text: "Her scheming forced this on me.",
        link: "http://gameofthrones.wikia.com/wiki/Margaery_Tyrell"
    },
    likedBy: [],
    ts: Date.now() - 1000000
}];


// username which are currently connected to the chat
var usernames = {};
var numUsers = 0;

/**
 * Socket.IO server (single process only)
 */
/*io.on('connection', function (socket) {
    //var address = socket.handshake.address;
    //console.log('New Connection from : ' + address.address + ' port : ' + address.port);
    socket.emit("messages", listOfMessages);
    var addedUser = false;
    socket.on('new-message', function (data) {
        *//*console.log('new-message username : ' + data.userName
         + " content : " + data.content.link
         + " text : " + data.content.text);*//*
        listOfMessages.push(data);
        // this line just emit for connected socket client
        //socket.emit("messages", listOfMessages);
        // this line just emit for all client those connected
        io.sockets.emit("messages", listOfMessages);
    });

    socket.on("update-message", function (data) {
        //console.info("update-message : "+data);
        var message = listOfMessages.filter(function (message) {
            return message.messageId == data.messageId;
        })[0];

        message.likedBy = data.likedBy;
        io.sockets.emit("messages", listOfMessages);
    });

    // when the client emits 'new message', this listens and executes
    socket.on('chat-send-message', function (data) {
        //    tell the client to executed 'new message'
        //console.log('chat-send-message : ', data);
        io.sockets.emit('chat-update-messages', data);
    });

    // when the client emits 'chat-add-user', this listens and executes
    socket.on('chat-add-user', function (username) {
        //    store the username in the socket session for this client
        socket.username = username;
        //    add the client's username to the global list
        username[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('chat-login', {numUsers: numUsers});
        //    echo globally (all clients) that a person has connected
        socket.broadcast.emit('cha-user-joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });
    // when the clients emits 'typing', we broadcast it to others
    socket.on('chat-typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('chat-stop-typing', function () {
        socket.broadcast.emit('chat-stop-typing', {
            username: socket.username
        });
    });

    // when the user disconnects.perform this
    socket.on('disconnect', function () {
        //    remove the username from global username list
        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;
        }
        // echo globally tha this user left
        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    });
});*/

