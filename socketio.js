/**
 * Socket.IO server (single process only)
 * Created by k1 on 12/11/15.
 */
var config = require('./config');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var numUsers = 0;
module.exports = function (server, io, sessionMiddleware) {

    io.use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    })

    io.on('connection', function (socket) {
        if (socket.request.session.passport) {
            var userName = socket.request.session.passport.user;
            console.log("Connection for passport username : ", userName);
            numUsers++;
            var addedUser = true;
        }
        //var address = socket.handshake.address;
        console.log(socket.request.method, socket.request.url);
        Post.find(function (err, posts) {
            //console.log('POSTS', posts);
            if (err) {
                console.log('update-posts', err);
            } else {
                io.sockets.emit("update-posts", posts);
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


            // this line just emit for connected socket client
            //console.log("POST:>>> ", listOfPosts);

            // this line just emit for all client those connected
            //io.sockets.emit("new-post-result", {post: post});
        });


        socket.on("update-message", function (data) {
            //console.info("update-message : "+data);
            var message = listOfMessages.filter(function (message) {
                return message.messageId == data.messageId;
            })[0];

            message.likedBy = data.likedBy;
            io.sockets.emit("messages", listOfMessages);
        });

        /********   CHATS  ********/
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
                //delete usernames[socket.username];
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