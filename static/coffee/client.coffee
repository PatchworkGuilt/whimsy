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
