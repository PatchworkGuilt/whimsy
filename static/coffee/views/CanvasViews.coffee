CanvasModels = require('../models/CanvasModels')
_ = require('underscore')
$ = require('jquery')
Backbone = require('backbone')
Backbone.$ = $
Raphael = require('raphael')

class CanvasView extends Backbone.View
    initialize: ->
        @paper = Raphael 'viewport', '100%', '100%'
        @paper.width = $("#viewport").width()
        @paper.height = $("#viewport").height()
        @model.shapesCollection.on 'add', (shape) =>
            @addNewShape shape
        @selectedFrameView = new SelectedFrameView
            paper: @paper
        @render()

    addNewShape: (shapeModel)=>
        shapeView = new SVGView
            model: shapeModel
            paper: @paper

        paper = @paper
        shapeModel.on 'change:selectedBy', =>
            @selectedFrameView?.detach()
            if shapeModel.isSelectedByMe()
                @selectedFrameView.attachTo(shapeView)
            else if shapeModel.isSelectedByOther()
                @frameView = new UnavailableFrameView
                    paper: paper
                    shape: shapeView

    render: ->
        @CELL_HEIGHT = 40
        @CELL_WIDTH = 40
        startPoint = {x: 0, y: @paper.height}
        for shape, index in ['star', 'star', 'star']
            shapeOrigin =
                x: startPoint.x + (@CELL_WIDTH * index)
                y: startPoint.y - @CELL_HEIGHT
            @drawTool(shape, shapeOrigin.x, shapeOrigin.y)

    drawTool: (name, x, y) =>
        @paper.rect(x, y, @CELL_WIDTH, @CELL_HEIGHT)
            .attr({fill: 'gray'})
            .toBack()
        startingLoc = {x: x + (@CELL_WIDTH/2), y: y + (@CELL_HEIGHT/2)}
        toolModel = new CanvasModels.SVGModel(startingLoc)
        toolModel.doNotSync = true
        toolView = new SVGView({
            model: toolModel
            paper: @paper
        })
        toolModel.scaleToSize({x: @CELL_WIDTH, y: @CELL_HEIGHT})

        toolModel.on 'drag:end', =>
            @model.queueNewShape toolModel
            toolModel.setLocation startingLoc.x, startingLoc.y

class ShapeView extends Backbone.View
    initialize: (options) =>
        @paper = options.paper
        @render()
        @model.on "change", @render
        @model.on "remove", @remove

    addListeners: =>
        @addDrag()
        @addClick()

    remove: =>
        @drawnShape?.remove()
        @frameView?.remove()

    render: =>
        unless @drawnShape
            @drawNewShape()
            @addListeners()
        @updateShape()
        @drawnShape.toFront()

    updateShape: =>
        json = @model.get('attr')
        @drawnShape.attr(json)
        @transformShape()

    drawNewShape: ->
        null

    addDrag: =>
        didDrag = false
        start = =>
            @startX = @model.get('x')
            @startY = @model.get('y')
        move = (dx,dy, x, y) =>
            @model.setLocation(@startX + dx, @startY + dy)
            didDrag = true
        stop = =>
            if didDrag
                didDrag = false
                @model.trigger('drag:end')
        @drawnShape.drag(move, start, stop)

    addClick: (shape) =>
        @drawnShape.click =>
            @model.select()
            @

class SVGView extends ShapeView
    drawNewShape: =>
        @drawnShape = @paper.path(@model.get("path")).attr(@model.get('attr'))

    transformShape: =>
        scale = @model.get('scale') || {x: 1, y: 1}
        loc = @model.getCurrentLocation()
        path = @drawnShape.transform("s#{scale.x},#{scale.y}T#{loc.x},#{loc.y}")

class ShapeFrameView extends Backbone.View
    initialize: (options) =>
        @paper = options.paper

    remove: ->
        @frame?.remove()

    attachTo: (shape)=>
        @shape = shape
        shape.model.on 'change', @render

    detach: ->
        @frame?.hide()

    calculateBorder: (shape)->
        bbox = shape.drawnShape.getBBox()
        PADDING = 5
        return {
            x: bbox.x - PADDING
            y: bbox.y - PADDING
            width: bbox.width + (2 * PADDING)
            height: bbox.height + (2 * PADDING)
        }

    render: =>
        border = @calculateBorder(@shape)
        @frame?.remove()
        @frame = @paper.rect(border.x, border.y, border.width, border.height)
        @frame.attr
            stroke: @color

class SelectedFrameView extends ShapeFrameView
    initialize: (options) =>
        super(options)
        @color = 'blue'

    remove: ->
        super()
        @gripPoint?.remove()

    detach: ->
        super()
        @gripPoint?.hide()
        @stopListening()

    render: =>
        super()
        border = @calculateBorder(@shape)
        BRCorner =
            x: border.x + border.width
            y: border.y + border.height
        @startPoint = @startPoint ||
            x: BRCorner.x
            y: BRCorner.y
        if @gripPoint
            @gripPoint.show()
            @gripPoint.transform "T#{BRCorner.x - @startPoint.x},#{BRCorner.y - @startPoint.y}"
        else
            @gripPoint = @paper.circle BRCorner.x, BRCorner.y, 5
            @gripPoint.attr
                fill: 'lightgray'
                stroke: 'black'
            start = =>
                @startPoint =
                    x: BRCorner.x
                    y: BRCorner.y
                @startSize = @shape.model.getCurrentSize()
            move = (dx,dy, x, y) =>
                newSize =
                    x: @startSize.x + (2 * dx)
                    y: @startSize.y + (2 * dy)
                @shape.model.scaleToSize(newSize, true)
            end = =>
                return
            @gripPoint.drag(move, start, end)

class UnavailableFrameView extends ShapeFrameView
    initialize: (options) =>
        super(options)
        @color = 'red'

module.exports = {
    CanvasView: CanvasView
    SVGView: SVGView
}

