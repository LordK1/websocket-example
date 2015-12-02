var socket = io.connect('http://localhost:8080', {
    'forceNew': true
});

socket.on("messages", function (data) {
    console.info(data);

    var html = data.map(function (data) {
        return ('' +
        '<div class="name">'
        + '</div>'
        + data.userName
        + '<a class="message" href=' + data.content.link + ' target=blank>'
        + data.content.text
        + '</a>'
        )
    }).join("");


    document.getElementById("messages").innerHTML = html;
});

function addMessage(e) {
    var payload =
    {
        userName: document.getElementById("username").value,
        content: {
            text: document.getElementById("message").value,
            link: document.getElementById("linkAddress").value

        },
        ts: Date.now()
    }
    socket.emit("new-message", payload);
    return false;
}