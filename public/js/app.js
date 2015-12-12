/**
 * Created by k1 on 12/6/15.
 */
/*var socket = io.connect({
 'forceNew': true
 });*/
var socket = io.connect(window.location.hostname + ":" + window.location.port, {
        'forceNew': true
    }
);
socket.on('test', function (data) {
    console.log(data + " session : " + socket.request);
});
var listOfPosts = [];
socket.on('new-post-result', function (data) {
    render(data);
});

socket.on('update-posts',function(data){
    console.log("posts ", data, " listOfPosts.length : ", listOfPosts.length);
    listOfPosts.push(data);
    render(data);
});

function render(data) {
    var html = data.sort(function (a, b) {
        return a.created_date - b.created_date;
    }).map(function (data, index) {
        return (
        '<form class="name" onsubmit="return likeMessage(messageCache[' + index + ']);">'
        + '<div class="name">'
        + data.user
        + '<br>'
        + data.link
        + '</div>'
        + '<p class="content-link" >'
        + data.content
        + '</p>'
        + '<div class="time"><span class="glyphicon-time"></span>'
        + moment(data.created_date).fromNow()
        + '</div>'
        + '<input type="submit" class="like-count" value="' + data.likes + ' Likes"  >'
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
        var post =
        {
            link: document.getElementById("link").value,
            content: document.getElementById("content").value,
            likeCount: 0,
            user_id: user._id
        }
        console.info("post : ", post);
        socket.emit("new-post", post);
        return false;
    } else {
        alert('OOPPs R U kidding me, first login !!!');
    }

}
