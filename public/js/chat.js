/**
 * Created by k1 on 12/6/15.
 */
var socket = io.connect('http://0.0.0.0:3000', {
    'forceNew': true
});

var listOfMessages = [];
socket.on("chat-update-messages", function (data) {
    //console.info("chat-update-messages", data);
    listOfMessages.push(data);
    alert(data.username + " message : " + data.message);
    render();
});


function render() {
    var html = listOfMessages.map(function (data) {
        return (
        +'<div class="name">'
        + data.username
        + ' says : </div>'
        + '<p>'
        + data.message
        + '</p>'
        + '<div class="time"><span class="glyphicon-time"></span>'
        + moment(data.ts).fromNow()
        + '</div>'
        )
    }).join("");

    document.getElementById("messages").innerHTML = html;
}

function chatSendNewMessage(e) {
    var playLoad = {
        username: document.getElementById("username").value,
        message: document.getElementById("message").value,
        ts: Date.now()
    }
    socket.emit("chat-send-message", playLoad)
    return false;
}