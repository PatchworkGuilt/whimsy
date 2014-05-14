requirejs.config({
    "paths": {
      "jquery": "third-party/jquery-1.11.1.min",
      'raphael': 'third-party/raphael-2.1.2',
      'socketio': '/socket.io/socket.io.js',
      'stopwatch': 'util/StopWatch'
    }
});

require([
    'raphael',
    'socketio',
    'jquery',
    'stopwatch'
], function(Raphael, io, $, StopWatch)
{
    var socket = io.connect(document.URL);
    var paper = Raphael('viewport', 800, 400);
    var stopwatch = new StopWatch();
    stopwatch.logFPS();
    socket.on('render', function (data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            paper.circle(body['x'], body['y'], body['radius']);
        });
        stopwatch.tickFrame();
    });

    $('#viewport').click(function(event){
        eventData = {
            type: 'circle',
            x: event.offsetX,
            y: event.offsetY,
            radius: Math.floor(Math.random()*20)
        };
        socket.emit('add', eventData);
        console.log(eventData.radius);
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
