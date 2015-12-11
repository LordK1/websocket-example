/**
 * Socket.IO server (single process only)
 * Created by k1 on 12/11/15.
 */
var config = require('./config');
var cookieParser = require('cookie-parser');
var passport = require('passport');

// username which are currently connected to the chat
var numUsers = 0;

module.exports = function (server, io, mongoStore) {
    /*io.use(function (socket, next) {
        cookieParser(config.sessionSecret)(socket.request), {}, function (err) {
            var sessionId = socket.request.signedCookies['connection.sig'];
            mongoStore.get(sessionId, function (err, session) {
                socket.request.session = session;
                passport.initialize()(socket.request, {}, function () {
                    passport.session()(socket.request, {}, function () {
                        if (socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated :@'), false);
                        }
                    });
                });
            });
        }
    });*/

    io.on('connection', function (socket) {
        //var address = socket.handshake.address;
        console.log('Socket.io Connected :P');
        socket.emit("test", "Helllo this is test !!!");
        var addedUser = false;
        socket.on('new-message', function (data) {
            console.log('new-message username : ' + data.userName
            + " content : " + data.content.link
            + " text : " + data.content.text);
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
    });
}