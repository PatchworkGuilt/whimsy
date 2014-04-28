window.onload = function() {
    var messages = [];
    var socket = io.connect(document.URL);
    var paper = Raphael('viewport', 800, 400);
    socket.on('message', function (data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            paper.circle(body['x'], body['y'], body['radius']);
        });
    });
}
