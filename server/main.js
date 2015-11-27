var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/*
app.get('/',function (req , res) {
	res.send("Hello Express and Socket.io World !!!");
	console.log("Somthing connected to Express !!!");
});
*/
// serve statics as express statics
app.use(express.static('app'));

io.on('connection', function(socket) {
    console.log("Somthing connected to Express !!!");
    console.log('Somthing connected to Socket.io');
    socket.emit("messages", ["Hello", "Hi there", "How Are You ?!"]);

});

server.listen(8080);
