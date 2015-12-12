/**
 * Created by k1 on 12/6/15.
 */
var socket = io.connect(window.location.hostname + ":" + window.location.port, {
        'forceNew': true
    }
);

var listOfMessages = [];
socket.on("chat-update-messages", function (data) {
    listOfMessages.push(data);
    render();
});


function render() {
    var html = listOfMessages.map(function (data) {
        return (
            '<div class="message-item">' + '<div class="name">'
            + data.username
            + '</div>'
            + '<p >'
            + data.message
            + '</p>'
            + '<div class="time"><span class="glyphicon-time"></span>'
            + moment(data.ts).fromNow()
            + '</div>'

        )
    }).join("\n");
    document.getElementById("messages").innerHTML = html;
}

function chatSendNewMessage(e) {
    var playLoad = {
        username: user,
        message: document.getElementById("message").value,
        ts: Date.now()
    }
    socket.emit("chat-send-message", playLoad)
    return false;
}