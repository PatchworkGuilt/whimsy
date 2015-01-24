express = require "express"
requirejs = require "requirejs"
app = express()
port = process.env.PORT || 3700

requirejs.config
    baseUrl: './static/build/js'
    nodeRequire: require

app.set('views', __dirname + '/static/html')
app.engine('html', require('ejs').renderFile)
app.post "/create_new_room", (req, res) ->
    requirejs ['util/db'], (db) ->
        room = db.createRoom()
        res.redirect("/" + room['_id'])

app.get "/:room_id", (req, res) ->
    requirejs ['util/db'], (db) ->
        db.getRoom req.params.room_id, (err, room) ->
            if room
                res.render "index.html"
            else
                res.status(404).send 'Room Not Found!'

app.get "/", (req, res) ->
    #Eventually, this will be a landing page.
    res.render "index.html"

app.use(express.static(__dirname + '/static/'))


requirejs ['World'], (World) ->
    io = require('socket.io').listen(app.listen(port))
    rooms = {}

    io.sockets.on 'connection', (socket) ->
        console.log "connected"
        room_id = null
        broadcast = (name, worldData) ->
            if room_id
                io.to(room_id).emit('broadcast', {name: name, data: worldData})
            else
                socket.emit("InvalidStateError", "No Room_ID")

        socket.on 'room', (id) ->
            room_id = id
            socket.join(room_id)

            unless room_id of rooms
                rooms[room_id] = new World(broadcast, room_id)
                console.log('created room', room_id)

            socket.room = rooms[room_id]

            socket.room.getBodies (bodies) ->
                socket.emit 'broadcast', {
                    name: 'resetTo'
                    data: JSON.stringify(bodies)
                }

        socket.on 'addBody', (data) ->
            socket.room.emit('addBody', data)

        socket.on 'updateBody', (data) ->
            socket.room.emit('updateBody', data)

        socket.on 'disconnect', ->
            console.log "disconnect"


console.log("Listening on port " + port)
