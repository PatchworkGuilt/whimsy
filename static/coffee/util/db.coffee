define ['mongoose'], (mongoose) ->
    ObjectID = require('mongodb').ObjectID
    #  from ~/Documents/whimsy/mongo
    #  ./mongod --dbpath ~/Documents/whimsy/data/
    dbURI = 'mongodb://localhost:27017/test'
    mongoose.connect dbURI

    # CONNECTION EVENTS
    mongoose.connection.on 'connected', ->
      console.log 'Mongoose default connection open to ' + dbURI

    mongoose.connection.on 'error', (err) ->
      console.log 'Mongoose default connection error: ' + err

    mongoose.connection.on 'disconnected', ->
      console.log 'Mongoose default connection disconnected'

    # If the Node process ends, close the Mongoose connection
    process.on 'SIGINT', ->
      mongoose.connection.close ->
        console.log 'Mongoose default connection disconnected through app termination'
        process.exit(0)

    shapeSchema = mongoose.Schema
        type: String
        x: Number
        y: Number
        selectedBy: String
        scale: {
            x: Number
            y: Number
        }

    roomSchema = mongoose.Schema
        shapes: [shapeSchema]

    Room = mongoose.model('Room', roomSchema)
    Shape = mongoose.model('Shape', shapeSchema)


    return {
        updateShape: (roomId, shapeId, shape) ->
            Room.findById roomId, (err, room) ->
                if (err)
                    console.log "ERROR updating shape: couldnt find room " + roomId
                shape_doc = room.shapes.id(new ObjectID(shapeId))
                for key of shape
                    shape_doc[key] = shape[key]
                room.save (err) ->
                    if(err)
                        console.log "ERROR updating shape in " + roomId, err

        addShape: (roomId, shape) ->
            Room.findById roomId, (err, room) ->
                if(err)
                    console.log("ERROR saving shape to " + roomId, err)
                room.shapes.push(shape)
                room.save (err) ->
                    if(err)
                        console.log("ERROR saving shape to " + roomId, err)

        getAllShapes: (roomId, callback) ->
            Room.findById roomId, (err, room) ->
                if (err)
                    console.log "ERROR getting shapes from room " + roomId
                callback room?.shapes

        createRoom: ->
            room = new Room()
            room.save()
            return room

        getRoom: (roomId, callback) ->
            Room.find({'_id': roomId}, callback)

        getNewId: ->
            return new ObjectID()
    }
