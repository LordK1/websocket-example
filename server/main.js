var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// serve statics as express statics
app.use('/bower_components', express.static('bower_components'));
app.use(express.static('app'));

/*
 app.get('/',function (req , res) {
 res.send("Hello Express and Socket.io World !!!");
 console.log("Somthing connected to Express !!!");
 });
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


io.on('connection', function (socket) {
    // console.log('Somthing connected to Socket.io');
    socket.emit("messages", listOfMessages);

    socket.on('new-message', function (data) {
        /*console.log('new-message username : ' + data.userName
         + " content : " + data.content.link
         + " text : " + data.content.text);*/
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
});

server.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is running on http://0.0.0.0:%s', port);
});
