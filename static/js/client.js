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
    'worldProxy',
    'boxOfThings'
], function(Raphael, $, StopWatch, worldProxy, boxOfThings)
{
    var shapeType = "circle";
    var paper = Raphael('viewport', "100%", "100%");
    function render(data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        worldBodies.forEach(function(body){
            boxOfThings.drawThing(body, paper);
        });
        stopwatch.tickFrame();
    };

    worldProxy.init(render);
    var stopwatch = new StopWatch();
    //stopwatch.logFPS();

    $('#viewport').click(function(event){
        var circle = boxOfThings.getThing(shapeType, event.offsetX, event.offsetY);
        worldProxy.add(circle);
    })

    $("input[name=toggleControl]").change(function(event){
        var value = event.target.value;
        if(value == "server")
            worldProxy.runOnServer();
        else if(value == "local")
            worldProxy.runLocally();
    });

    $("input[name=shapeType]").change(function(event){
        shapeType = event.target.value;
    });
});
