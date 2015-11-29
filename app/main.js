var socket = io.connect('http://localhost:8080', {
    'forceNew': true
});
socket.on("messages", function(data) {
    console.info(data);
    /*var html = data.map(function(data) {
        return ('<div>${data.userName}</div><a href=${data.content.link} target=blank>${data.content.text}</a>')
    }).join("");*/
	var html = data.map(function() {
		
		return data;
	});
    document.getElementById("messages").innerHTML = html;
});
