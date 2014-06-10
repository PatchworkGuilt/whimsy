requirejs.config({
    "paths": {
      "jquery": "third-party/jquery-1.11.1.min",
      'raphael': 'third-party/raphael-2.1.2',
      'socketio': '/socket.io/socket.io.js',
      'stopwatch': './util/StopWatch',
      'worldManager': 'worldManager'
    }
});

require([
    'raphael',
    'jquery',
    'stopwatch',
    'worldManager'
], function(Raphael, $, StopWatch, worldManager)
{
    var paper = Raphael('viewport', 800, 400);
    //worldManager.runOnServer();
    worldManager.runLocally();
    var stopwatch = new StopWatch();
    //stopwatch.logFPS();
    worldManager.setRender(function (data) {
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
        worldManager.add(eventData);
    })

    $("#toggleControl").click(function(event){
        if(worldManager.isRunningLocally())
        {
            worldManager.runOnServer();
            $("#toggleControl").html("Run Locally");
        }
        else
        {
            worldManager.runLocally();
            $("#toggleControl").html("Run On Server");
        }
    })

});
