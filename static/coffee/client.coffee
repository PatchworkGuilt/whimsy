
requirejs.config
    paths:
      "jquery": "third-party/jquery-1.11.1.min"
      'raphael': 'third-party/raphael-2.1.2'
      'socketio': '/socket.io/socket.io.js'
      'stopwatch': './util/StopWatch'
      'worldProxy': 'worldProxy'
      'backbone': 'third-party/backbone'
      'underscore': 'third-party/underscore'
    shim:
        'backbone':
            deps: ['underscore', 'jquery']
            exports: 'Backbone'
        'underscore':
            exports: '_'

require([
    'views/CanvasViews'
    'models/CanvasModels'
], (Views, Models) ->
    canvasView = new Views.CanvasView
        model: new Models.CanvasModel()

)

###
THIS PROBLEM IS NOT FIXED. IT IS HIDING. IT IS AN ASSHOLE
move2 = ->
    return console.log("move2")
start2 = ->
    return console.log("start2")
stop2 = ->
    return console.log("stop2")
paper = Raphael('viewport', 300, 300)
circle = paper.circle(100, 100, 10).attr({'fill': 'green'})
circle.drag(move2,start2,stop2)
###
