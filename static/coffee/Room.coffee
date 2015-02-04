define ->
    constructor = (broadcast, roomId, db) ->
        bodies = {}

        #Replicates the API of socketio so roomProxy can call local/server the same way
        emit = (name, data) =>
            switch (name)
                when 'addBody'
                    addBody(data)
                when 'updateBody'
                    updateBody(data)

        addBody = (data) ->
            if data
                newID = db.getNewId()
                data._id = newID
                bodies[newID] = data
                broadcast('add', JSON.stringify(data))
                db.addShape(roomId, data)

        updateBody = (data) ->
            if data && data._id
                bodies[data._id] = data
                broadcast('update', JSON.stringify(data))
                db.updateShape(roomId, data._id, data)

        getBodies = (callback) =>
            db.getAllShapes roomId, callback

        return {
            emit: emit
            getBodies: getBodies
        }
    return constructor
