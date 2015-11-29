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
var messages = [{
    userId: 1,
    messageId: 10,
    userName: "Asha Geryjoy",
    content: {
        text: "The stone tree of Stonetrees.",
        link: "http://awoiaf.westreos.org/index.php/House_Stontree"
    },
    likedBy: [1],
    ts: Date.now() - 1000
}, {
    userId: 2,
    messageId: 11,
    userName: "Arya Stark",
    content: {
        text: "We'll come to see this inn.",
        link: "http://gameoftherones.wikia.com/wiki/Inn_at_the_Crossroads"
    },
    likedBy: [2, 3],
    ts: Date.now() - 100000
}, {
    userId: 3,
    messageId: 14,
    userName: "Cersei Lannister",
    content: {
        text: "Her scheming forced this on me.",
        link: "http://gameoftherones.wikia.com/wiki/Margaracy_Tyrell"
    },
    likedBy: [1],
    ts: Date.now() - 1000
}];

app.use(express.static('app'));

io.on('connection', function(socket) {
    // console.log("Somthing connected to Express !!!");
    // console.log('Somthing connected to Socket.io');
    socket.emit("messages", messages);
});

server.listen(8080);
