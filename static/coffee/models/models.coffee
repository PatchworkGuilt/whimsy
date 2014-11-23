define ['backbone', 'models/ShapeModels', 'worldProxy', 'shapeFactory'], (Backbone, ShapeModels, worldProxy, shapeFactory) ->
    class CanvasModel extends Backbone.Model
        initialize: (paper)->
            @shapesCollection = new ShapeModels.ShapesCollection()
            worldProxy.init @onBroadcastReceived

        setPaper: (paper) ->
            shapeFactory.setPaper paper

        onBroadcastReceived: (command, data) =>
            data = JSON.parse(data)
            switch command
                when 'resetTo' then @_resetTo(data)
                when 'add' then @_addShape(data)
                when 'update' then @_updateShape(data)

        queueNewShape: (data) ->
            shape = shapeFactory.createNewFromData(data)
            shape.model.save()

        #Update the shape locally.  Should only be called as a result of a message from server
        _updateShape: (updates) ->
            shape = @shapesCollection.get(updates._id)
            if shape
                #TODO: Validation
                shape.set(updates)
            else
                console.error("COULDN'T FIND SHAPE: " + updates._id)

        #Add the shape locally. Should only be called as a result of a message from server
        _addShape: (data) ->
            shape = shapeFactory.createNewFromData(data)
            shape.render()
            @shapesCollection.add(shape.model)

        #Clear all shapes and add all passed shapes. Should only be called as a result of a message from server
        _resetTo: (worldBodies) ->
            @shapesCollection.reset()
            for id of worldBodies
                @_addShape worldBodies[id]

    return {
        CanvasModel: CanvasModel
    }

