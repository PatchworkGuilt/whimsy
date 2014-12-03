define ['util/db'], (db) ->
    constructor = (broadcast, roomId) ->
        bodies = {}

        #Replicates the API of socketio so worldProxy can call local/server the same way
        emit = (name, data) =>
            switch (name)
                when 'addBody'
                    addBody(data)
                when 'updateBody'
                    updateBody(data)
                when 'selectBody'
                    selectBody(data)

        addBody = (data) ->
            newID = db.getNewId()
            data._id = newID
            bodies[newID] = data
            broadcast('add', JSON.stringify(data))
            db.addShape(roomId, data)

        updateBody = (data) ->
            if data._id
                bodies[data._id] = data
                broadcast('update', JSON.stringify(data))
                db.updateShape(roomId, data._id, data)

        selectBody = (data) ->
            broadcast('select', JSON.stringify(data))

        getBodies = =>
            return bodies

        return {
            emit: emit
            getBodies: getBodies
        }
    return constructor
