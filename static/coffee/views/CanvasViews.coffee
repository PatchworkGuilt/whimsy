define ['backbone', 'raphael', 'models/CanvasModels'], (Backbone, Raphael, CanvasModels) ->
    class CanvasView extends Backbone.View
        initialize: ->
            window.shapes = []
            @paper = Raphael 'viewport', '100%', '100%'
            @paper.width = $("#viewport").width()
            @paper.height = $("#viewport").height()
            @model.shapesCollection.on 'add', (shape) =>
                view = new SVGView
                    model: shape
                    paper: @paper
            @render()

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
            console.log "DRAWTOOL"
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
            toolModel.on 'drag:end', =>
                console.log "DRAGEND"
                @model.queueNewShape toolModel
                toolModel.setLocation startingLoc.x, startingLoc.y

    class ShapeView extends Backbone.View
        initialize: (options) =>
            @paper = options.paper
            @render()
            @model.on "change", @render
            @model.on "remove", @remove
            window.shapes.push @

        addListeners: =>
            @addDrag()
            @addClick()

        drawAsSelected: =>
            bbox = @drawnShape.getBBox()
            rect = @paper.rect(bbox.x, bbox.y, bbox.width, bbox.height)
            rect.attr
                stroke: 'blue'
            @selectedBox = rect

        drawAsUnavailable: =>
            bbox = @drawnShape.getBBox()
            rect = @paper.rect(bbox.x, bbox.y, bbox.width, bbox.height)
            rect.attr
                stroke: 'red'
            @selectedBox = rect

        remove: =>
            @drawnShape?.remove()
            @selectedBox?.remove()

        render: =>
            if @drawnShape
                @updateShape()
            else
                @drawNewShape()
                @addListeners()
            if @selectedBox
                @selectedBox.remove()
                @selectedBox = null
            if @model.isSelectedByMe()
                @drawAsSelected()
            else if @model.isSelectedByOther()
                @drawAsUnavailable()
            @drawnShape.toFront()

        updateShape: =>
            json = @model.toJSON()
            @drawnShape.attr(json)

        drawNewShape: ->
            null

        addDrag: =>
            didDrag = false
            start = =>
                console.log "Start"
                @startX = @model.get('x')
                @startY = @model.get('y')
            move = (dx,dy, x, y) =>
                console.log "move"
                @model.setLocation(@startX + dx, @startY + dy)
                didDrag = true
            stop = =>
                console.log "stop"
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
            console.log "new shape"
            @drawnShape = @paper.path(@model.get("path")).attr(@model.get('attr'))
            @updateScale()
            @transformShape()

        updateScale: =>
            bbox = @drawnShape.getBBox()
            width = @model.get('width')
            height = @model.get('height')
            scale = {x: width / bbox.width, y: height / bbox.height}
            @model.set('scale', scale, {'silent': true})

        transformShape: =>
            scale = @model.get('scale')
            loc = @model.getCurrentLocation()
            path = @drawnShape.transform("s#{scale.x},#{scale.y}T#{loc.x},#{loc.y}")

    return {
        CanvasView: CanvasView
        SVGView: SVGView
    }

