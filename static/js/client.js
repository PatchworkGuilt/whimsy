requirejs.config({
    "paths": {
      "jquery": "third-party/jquery-1.11.1.min",
      'raphael': 'third-party/raphael-2.1.2',
      'socketio': '/socket.io/socket.io.js',
      'stopwatch': './util/StopWatch',
      'worldProxy': 'worldProxy',
      'backbone': 'third-party/backbone',
      'underscore': 'third-party/underscore'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require([
    'raphael',
    'jquery',
    'stopwatch',
    'worldProxy',
    'shapeFactory',
    'ToolBox',
    'models/ShapeModels'
], function(Raphael, $, StopWatch, worldProxy, shapeFactory, ToolBox, ShapeModels)
{
    var allShapes = new ShapeModels.ShapeCollection();
    var dragStopTime = 0;
    var paper = Raphael('viewport', "100%", "100%");
    paper.width = $("#viewport").width();
    paper.height = $("#viewport").height();

    shapeFactory.setPaper(paper);

    function broadcastReceived(name, data) {
        console.log("GOT BROADCAST", name);
        var data = JSON.parse(data);
        switch (name)
        {
            case 'resetTo':
                resetTo(data);
                break;
            case 'add':
                add(data);
                break;
            case 'update':
                update(data);
                break;
            case 'select':
                selectBody(data);
                break;
        }
    };

    //Update the shape locally.  Should only be called as a result of a message from server
    function update(updates) {
        var shape = allShapes.get(updates.id);
        if(shape)
        {
            //TODO: Validation
            shape.model.set(updates);
        }
        else
            console.error("COULDN'T FIND SHAPE: " + updates.id);
    };

    //Add the shape locally. Should only be called as a result of a message from server
    function add(data){
        var shape = shapeFactory.createNewFromData(data);
        allShapes.add(shape);
    };

    function selectBody(data) {
        //shapes[data.id].shape.attr({fill: 'pink'});
    }

    function resetTo(worldBodies) {
        //paper.clear();
        allShapes.reset();
        for(var id in worldBodies)
        {
            add(worldBodies[id]);
        }
    }

    worldProxy.init(broadcastReceived);
    var tools = new ToolBox(paper, ['circle', 'owl', 'rect'], function(event, data){
        switch(event){
            case 'add':
                var shape = shapeFactory.createNewFromData(data);
                worldProxy.add(shape.model.toJSON());
                break;
        }
    });
});
