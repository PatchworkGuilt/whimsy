var express = require("express");
var world = require('./static/js/world-engine.js');
var app = express();
var port = 3700;

app.set('views', __dirname + '/static/jade');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("index");
});

app.use(express.static(__dirname + '/static/js'));

var io = require('socket.io').listen(app.listen(port));
io.set('log level', 2);
io.sockets.on('connection', function (socket) {
    socket.emit('message', world.toJSON());
    world.eventEmitter.on('tick', function (data) {
        io.sockets.emit('message', world.toJSON());
    });
});

console.log("Listening on port " + port);
