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
    shapes = {};
    var paper = Raphael('viewport', "100%", "100%");

    function broadcast(name, data) {
        console.log("GOT BROADCAST", name);
        switch (name)
        {
            case 'render':
                render(data);
                break;
            case 'add':
                add(data);
                break;
            case 'update':
                update(data);
        }
    };

    //Update the shape locally.  Should only be called as a result of a message from server
    function update(data) {
        var data = JSON.parse(data);
        if(shapes[data.id])
        {
            var shape = shapes[data.id].shape;
            shape.attr({
                cx: data.x,
                cy: data.y
            });
        };
    };

    //Add the shape locally. Should only be called as a result of a message from server
    function add(data){
        if(typeof data == "string")
            data = JSON.parse(data);
        var drawnShape = boxOfThings.drawThing(data, paper)
        function start() {
            this.startX = this.attr('cx');
            this.startY = this.attr('cy');
            console.log('start');
        };
        function move(dx,dy, x, y) {
            var shapeData = shapes[data.id].metadata;
            shapeData.x = this.startX + dx;
            shapeData.y = this.startY + dy;
            worldProxy.update(shapeData);
            console.log('move');
        };
        function stop() {
            console.log('stop');
        };
        drawnShape.drag(move, start, stop);
        shapes[data.id] = {
            metadata: data,
            shape: drawnShape
        }

    };

    function render(data) {
        paper.clear();
        var worldBodies = JSON.parse(data);
        for(var id in worldBodies)
        {
            add(worldBodies[id]);
        }
        stopwatch.tickFrame();
    }

    worldProxy.init(broadcast);
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
