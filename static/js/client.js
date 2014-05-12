requirejs.config({
    "paths": {
      "jquery": "third-party/jquery-1.11.1.min",
      'raphael': 'third-party/raphael-2.1.2',
      'socketio': '/socket.io/socket.io.js'
    }
});

require([
    'raphael',
    'socketio',
    'jquery'
], function(Raphael, io, $)
{
    var socket = io.connect(document.URL);
    var paper = Raphael('viewport', 800, 400);
    socket.on('render', function (data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            paper.circle(body['x'], body['y'], body['radius']);
        });
    });

    $('#viewport').click(function(event){
        paper.circle(event.offsetX, event.offsetY, 10);
        eventData = {
            type: 'circle',
            x: event.offsetX,
            y: event.offsetY,
            radius: 20
        };
        socket.emit('add', eventData);
    })

    socket.on('disconnect', function () {
        console.log("What happen?");
    });
    socket.on('reconnecting', function () {
        console.log("Come back!");
    });
    socket.on('reconnect_failed', function () {
        console.log("Fuck.");
    });
});
