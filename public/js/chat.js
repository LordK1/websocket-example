/**
 * Created by k1 on 12/6/15.
 */
var socket = io.connect(window.location.hostname + ":" + window.location.port, {
        'forceNew': true
    }
);

socket.on('connect', function () {
    //socket.emit('addUser', alert(user));
    if (user) {
        socket.emit('addUser', user);
    } else {
        loginRedirect();
    }
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
    $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
});

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function (rooms, current_room) {
    $('#rooms-list').empty();
    $.each(rooms, function (key, value) {
        if (value == current_room) {
            $('#rooms-list').append('<div>' + value + '</div>');
        }
        else {
            $('#rooms-list').append('<div><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></div>');
        }
    });
});

function switchRoom(room) {
    if (user) {
        socket.emit('switchRoom', room);
    } else {
        loginRedirect();
    }

}
function loginRedirect() {
    alert("You must login first");
    //window.location.replace("/login");
}
// on load of page
$(function () {
    // when the client clicks SEND
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
});


socket.on("update-users", function (data) {

    $.each(data, function (i, item) {
        console.log(i, item);
        $('#user-list').append('<li>'
        + '<a href="#" onclick="switchRoom(\'' + item + '\')">'
        + ' ' + item.username + '</a></li>');
    });

});

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
        + moment(data.created_at).fromNow()
        + '</div>'

        )
    }).join("\n");
    document.getElementById("messages").innerHTML = html;
}

function chatSendNewMessage(e) {
    var playLoad = {
        username: user,
        message: document.getElementById("message").value,
    }
    socket.emit("chat-send-message", playLoad)
    return false;
}