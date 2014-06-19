requirejs.config({
    "paths": {
      "jquery": "third-party/jquery-1.11.1.min",
      'raphael': 'third-party/raphael-2.1.2',
      'socketio': '/socket.io/socket.io.js',
      'stopwatch': './util/StopWatch',
      'worldProxy': 'worldProxy'
    }
});

require([
    'raphael',
    'jquery',
    'stopwatch',
    'worldProxy'
], function(Raphael, $, StopWatch, worldProxy)
{
    var paper = Raphael('viewport', 800, 400);
    function render(data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            paper.circle(body['x'], body['y'], body['radius']);
        });
        stopwatch.tickFrame();
    };

    worldProxy.init(render);
    var stopwatch = new StopWatch();
    //stopwatch.logFPS();

    $('#viewport').click(function(event){
        eventData = {
            type: 'circle',
            x: event.offsetX,
            y: event.offsetY,
            radius: Math.floor(Math.random()*20)
        };
        worldProxy.add(eventData);
    })

    $("#toggleControl").click(function(event){
        if(worldProxy.isRunningLocally())
        {
            worldProxy.runOnServer();
            $("#toggleControl").html("Run Locally");
        }
        else
        {
            worldProxy.runLocally();
            $("#toggleControl").html("Run On Server");
        }
    })

});
