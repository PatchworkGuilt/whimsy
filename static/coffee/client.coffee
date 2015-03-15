$ = require('jquery')
Views = require('./views/CanvasViews')
Models = require('./models/CanvasModels')
$ =>
    canvasView = new Views.CanvasView
        model: new Models.CanvasModel()

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
