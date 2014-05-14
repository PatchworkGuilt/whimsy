var express = require("express");
var requirejs = require("requirejs");
var app = express();
var port = process.env.PORT || 3700;

app.set('views', __dirname + '/static/jade');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("index");
});

app.use(express.static(__dirname + '/static/'));

var FPS = 60.0;
var timestep = 1000 / FPS;
var room_id = "room1"; //Temporary, obviously

requirejs(['./static/js/WorldEngine', 'static/js/util/StopWatch'], function(WorldEngine, StopWatch) {
    var io = require('socket.io').listen(app.listen(port));
    io.set('log level', 2);
    var world;
    var stopwatch = new StopWatch();
    stopwatch.logFPS();
    function renderWorld(roomID, worldData){
        stopwatch.tickFrame();
        io.sockets.in(roomID).volatile.emit('render', worldData);
    };

    io.sockets.on('connection', function (socket) {
        socket.join(room_id);
        if(!world)
            world = new WorldEngine(timestep, renderWorld, room_id);
        socket.world = world;

        socket.on('add', function(data){
            socket.world.emit('addBody', data);
        });
    });
});
console.log("Listening on port " + port);
