Backbone = require('backbone')
RoomProxy = require('../roomProxy')
UserModel = require('../models/UserModel')

class CanvasModel extends Backbone.Model
    initialize: (paper)->
        @shapesCollection = new ShapesCollection()
        RoomProxy.on 'broadcastReceived', @onBroadcastReceived

    onBroadcastReceived: (command, data) =>
        data = JSON.parse(data)
        switch command
            when 'resetTo' then @_resetTo(data)
            when 'add' then @_addShape(data)
            when 'update' then @_updateShape(data)

    queueNewShape: (model) ->
        model.save()

    #Update the shape locally.  Should only be called as a result of a message from server
    _updateShape: (updates) ->
        shape = @shapesCollection.get(updates._id)
        if shape
            #TODO: Validation
            shape.clear()
            shape.set(updates)
        else
            console.error("COULDN'T FIND SHAPE: " + updates._id)

    #Add the shape locally. Should only be called as a result of a message from server
    _addShape: (data) =>
        model = new SVGModel(data)
        @shapesCollection.add(model)

    #Clear all shapes and add all passed shapes. Should only be called as a result of a message from server
    _resetTo: (bodies) ->
        @shapesCollection.reset()
        for body in bodies
            @_addShape body

class ShapeModel extends Backbone.Model
    idAttribute: '_id'

    sync: (method, model, options) =>
        switch(method)
            when 'update'
                unless model.doNotSync
                    RoomProxy.update(model.toJSON())
            when 'create'
                RoomProxy.add(model.toJSON())
            else
                Backbone.sync.call(method, model, options)

    setLocation: (x,y) ->
        updates =
            "x": x
            "y": y

        if @doNotSync
            @set(updates)
        else
            @save(updates)

    getCurrentLocation: ->
        offset = @get('centerOffset') || {x: 0, y:0}
        return {
            x: @get('x') + offset.x,
            y: @get('y') + offset.y
        }

    getCurrentSize: ->
        currentScale = @get('scale') || {x: 1, y: 1}
        currentSize =
            x: @get('baseWidth') * currentScale.x
            y: @get('baseHeight') * currentScale.y
        return currentSize

    setDefaults: (defaults) ->
        for key of defaults
            unless @has(key)
                @set key, defaults[key]

    scaleToSize: (newSize, save) ->
        baseSize =
            x: @get('baseWidth')
            y: @get('baseHeight')

        scale =
            x: newSize.x / baseSize.x
            y: newSize.y / baseSize.y
        if save
            @save 'scale', scale
        else
            @set 'scale', scale

    scaleBySize: (newSize) ->
        currentSize = @getCurrentSize()
        @scaleToSize
            x: currentSize.x + newSize.x
            y: currentSize.y + newSize.y

    select: ->
        #unless @get('selectedBy') EVENTUALLY, once we actually have user models
        @trigger('clicked', this)

    isSelectedByMe: ->
        return @get('selectedBy') == UserModel.get('id')

    isSelectedByOther: ->
        return @get('selectedBy') && @get('selectedBy') != UserModel.get('id')

class SVGModel extends ShapeModel
    initialize: =>
        @setDefaults
            type: 'star',
            baseHeight: 44.88970909118653,
            baseWidth: 47.1998332977295,
            path: "M 29,7.441432952880859 34.30384063720703,22.699893951416016 50.4544677734375,23.02901840209961 37.581787109375,32.78839111328125 42.25959014892578,48.25025939941406 29,39.02342987060547 15.740406036376953,48.25025939941406 20.418212890625,32.78839111328125 7.545528411865234,23.02901840209961 23.696163177490234,22.699893951416016 29,7.441432952880859 34.30384063720703,22.699893951416016 z",
            centerOffset: {
                x: -29,
                y: -27.8
            },
            attr:{
                stroke: '#000000',
                strokeWidth: '1',
                strokecolor: '#000000',
                fill: '#FF0000',
                orient: 'point',
                point: '5',
                shape: 'star',
                'stroke-opacity': '1'
            }
        @

class ShapesCollection extends Backbone.Collection
    model: ShapeModel

    initialize: ->
        @on 'clicked', @onClicked
        @selectedModel = null

    reset: (options) ->
        @each (model) ->
            model.trigger 'remove'
        super options

    onClicked: (model) =>
        @selectedModel?.unset 'selectedBy'
        @selectedModel?.save()
        @selectedModel = model
        model.save('selectedBy', UserModel.get('id'))

class SelectedShapesCollection extends Backbone.Collection
    model: ShapeModel

    initialize: ->
        @on 'add', (model)


module.exports = {
    CanvasModel: CanvasModel
    ShapeModel: ShapeModel
    SVGModel: SVGModel
    ShapesCollection: ShapesCollection
    SelectedShapesCollection: SelectedShapesCollection
}

