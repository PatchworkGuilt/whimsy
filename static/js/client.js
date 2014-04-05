window.onload = function() {

    var messages = [];
    var socket = io.connect(document.URL);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            messageURL = data.message + "<i>" + (Date.now() - data.timestamp) + " ms</i><br/>";
            content.innerHTML = content.innerHTML + messageURL;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text, timestamp: Date.now() });
    };

}
