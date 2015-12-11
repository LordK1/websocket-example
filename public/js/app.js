/**
 * Created by k1 on 12/6/15.
 */
var messageCache;

function randomId() {
    return Math.floor(Math.random() * 1e11);
}

var socket = io.connect({
    'forceNew': true
});
socket.on('test', function (data) {
    console.log(data);
});

socket.on("messages", function (data) {
    messageCache = data;
    render();
});


function render() {
    var data = messageCache;
    var html = data.sort(function (a, b) {
        return a.ts - b.ts;
    }).map(function (data, index) {
        return (
        '<form class="name" onsubmit="return likeMessage(messageCache[' + index + ']);">'
        + '<div class="name">'
        + data.userName
        + '</div>'
        + '<a class="content-link" href=' + data.content.link + ' target=blank>'
        + data.content.text
        + '</a>'
        + '<div class="time"><span class="glyphicon-time"></span>'
        + moment(data.ts).fromNow()
        + '</div>'
        + '<input type="submit" class="like-count" value="' + data.likedBy.length + ' Likes"  >'
        + '</form>'
        )
    }).join("");


    document.getElementById("messages").innerHTML = html;
}

function likeMessage(message) {
    console.info("likeMessage : " + message);
    var index = message.likedBy.indexOf(userId);
    if (index < 0) {
        message.likedBy.push(userId);
    } else {
        message.likedBy.splice(index, 1);
    }
    socket.emit("update-message", message);
    render();
    return false;
}

function createPost(e) {
    if (user) {
        var receivedPost =
        {
            link: document.getElementsByName("link").value,
            content: document.getElementById("content").value,
            likeCount: 0
        }
        socket.emit("new-message", payload);
        return false;
    }

}
