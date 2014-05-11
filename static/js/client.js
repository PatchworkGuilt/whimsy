window.onload = function() {
    var messages = [];
    var socket = io.connect(document.URL);
    var paper = Raphael('viewport', 800, 400);
    socket.on('render', function (data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            paper.circle(body['x'], body['y'], body['radius']);
        });
    });
    socket.on('disconnect', function () {
        console.log("What happen?");
    });
    socket.on('reconnecting', function () {
        console.log("Come back!");
    });
    socket.on('reconnect_failed', function () {
        console.log("Fuck.");
    });
}
