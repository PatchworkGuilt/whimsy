express = require "express"
requirejs = require "requirejs"
app = express()
port = process.env.PORT || 3700

requirejs.config
    baseUrl: './static/build/js'
    nodeRequire: require

args = process.argv.slice(2)
if args.indexOf('TEST_MODE') > -1
    global.TEST_MODE = true

app.set('views', __dirname + '/static/html')
app.engine('html', require('ejs').renderFile)
app.post "/create_new_room", (req, res) ->
    requirejs ['util/db'], (db) ->
        room = db.createRoom()
        res.redirect("/room/" + room['_id'])

app.get "/room/:room_id", (req, res) ->
    requirejs ['util/db'], (db) ->
        db.getRoom req.params.room_id, (err, room) ->
            if room
                res.render "index.html"
            else
                res.status(404).send 'Room Not Found!'

app.get "/", (req, res) ->
    #Eventually, this will be a landing page.
    res.render "index.html"

if global.TEST_MODE
    app.get '/run_tests', (req, res) ->
        res.render "test-index.html"

    app.use('/node_modules', express.static(__dirname + '/node_modules/'))
app.use(express.static(__dirname + '/static/'))


requirejs ['Room', 'util/db'], (Room, db) ->
    io = require('socket.io').listen(app.listen(port))
    rooms = {}

    io.sockets.on 'connection', (socket) ->
        console.log "connected"
        room_id = null
        broadcast = (name, roomData) ->
            if room_id
                io.to(room_id).emit('broadcast', {name: name, data: roomData})
            else
                socket.emit("InvalidStateError", "No Room_ID")

        socket.on 'room', (id) ->
            room_id = id
            socket.join(room_id)

            unless room_id of rooms
                rooms[room_id] = new Room(broadcast, room_id, db)
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
