/**
 * Socket.IO server (single process only)
 * Created by k1 on 12/11/15.
 */
var config = require('./config');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var usernames = {};
var rooms = ['room1', 'room2', 'room3'];

var numUsers = 0;
module.exports = function (server, io, sessionMiddleware) {

    io.use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', function (socket) {
        if (socket.request.session.passport) {
            var userName = socket.request.session.passport.user;
            //console.log("Connection for passport username : ", userName);
            numUsers++;
            var addedUser = true;
        }
        console.log(socket.request.method, socket.request.url);
        // at first update list of posts and users maybe
        Post.find(function (err, posts) {
            //console.log('POSTS', posts);
            if (err) {
                console.log('update-posts', err);
            } else {
                io.sockets.emit("update-posts", posts);
            }
        });


        User.find({'_id': {$ne: userName}}, function (err, users) {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                //console.log(' ---------- users : ', users);
                io.sockets.emit("update-users", users);
            }
        });

        /********   POSTS  ********/
            // Update list of Posts at first


        socket.on('new-post', function (data) {
            console.log('new-post : ' + data
                + " link : " + data.link
                + " user_id : " + data.user_id,
                +" content : " + data.content);

            new Post({
                link: data.link,
                content: data.content,
                user_id: socket.request.session.passport.user,
                likes: data.likeCount
            }).save(function (err, post) {
                    if (err) {
                        console.log('err', err);
                    } else {
                        console.log(post + " created successfully !!");
                        Post.find(function (err, posts) {
                            //console.log('POSTS', posts);
                            if (err) {
                                console.log('update-posts', err);
                            } else {
                                io.sockets.emit("update-posts", posts);
                            }
                        });
                    }
                });

        });

        /********   CHATS  ********/


        socket.on('chat-send-message', function (id, msg) {
            socket.broadcast.to(id).emit('my message', msg);
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
                //delete usernames[socket.username];
                --numUsers;
            }
            // echo globally tha this user left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        });


        /** Chat Rooms */
        socket.on('addUser', function (user) {
            console.log('addUser', user.username);
            socket.username = user.username;
            socket.user_id = user._id;
            socket.room = 'room1';
            usernames[user] = user;
            socket.join('room1');
            socket.emit('updatechat', 'SERVER', 'you have connected to room1');
            socket.broadcast.to('room1').emit('updatechat', 'SERVER', user.username + ' has connected to this room');
            socket.emit('updaterooms', rooms, 'room1');
        });

        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat', function (data) {
            console.log('sendchat', data);
            // we tell the client to execute 'updatechat' with 2 parameters
            io.sockets.in(socket.room).emit('updatechat', socket.username, data);
        });

        socket.on('switchRoom', function (newroom) {
            console.log('switchRoom', newroom);
            socket.leave(socket.room);
            socket.join(newroom);
            socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
            // sent message to OLD room
            socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
            // update socket session room title
            socket.room = newroom;
            socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
            socket.emit('updaterooms', rooms, newroom);
        });
        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            console.log('disconnect !!!');
            // remove the username from global usernames list
            delete usernames[socket.username];
            // update list of users in chat, client-side
            io.sockets.emit('updateusers', usernames);
            // echo globally that this client has left
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            socket.leave(socket.room);
        });

    });
}