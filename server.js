var express = require("express");
var requirejs = require("requirejs");
var app = express();
var port = process.env.PORT || 3700;

requirejs.config({
    baseUrl: './static/js',
    nodeRequire: require,
});

app.set('views', __dirname + '/static/html');
//app.set('view engine', "ejs");
app.engine('html', require('ejs').renderFile);
app.get("/", function(req, res){
    res.render("index.html");
});

app.use(express.static(__dirname + '/static/'));

var room_id = "room1"; //Temporary, obviously

requirejs(['World'], function(World) {
    var io = require('socket.io').listen(app.listen(port));
    //io.set('log level', 2);
    var world;

    io.sockets.on('connection', function (socket) {
        function broadcast(name, worldData){
            io.to(room_id).emit('broadcast', {name: name, data: worldData});
        };
        socket.join(room_id);
        console.log("connected");
        if(!world)
        {
            world = new World(broadcast, room_id);
        }
        socket.world = world;
        socket.emit('broadcast', {name: 'render', data: JSON.stringify(world.getBodies())});

        socket.on('addBody', function(data){
            console.log("add", data);
            socket.world.emit('addBody', data);
        });
        socket.on('updateBody', function(data){
            console.log("update", data);
            socket.world.emit('updateBody', data);
        });
        socket.on('disconnect', function(){
            console.log("disconnect");
        })
    });

});
console.log("Listening on port " + port);
