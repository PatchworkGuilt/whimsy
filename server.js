var express = require("express");
var requirejs = require("requirejs");
var app = express();
var port = process.env.PORT || 3700;

requirejs.config({
    baseUrl: './static/js',
    nodeRequire: require,
});

app.set('views', __dirname + '/static/html');
app.engine('html', require('ejs').renderFile);
app.get("/:room_id", function(req, res){
    res.render("index.html");
});
app.get("/", function(req, res){
    //Eventually, this will be a landing page.
    res.render("index.html");
});

app.use(express.static(__dirname + '/static/'));


requirejs(['World'], function(World) {
    var io = require('socket.io').listen(app.listen(port));
    var rooms = {};

    io.sockets.on('connection', function (socket) {
        var room_id;
        console.log("connected");
        function broadcast(name, worldData){
            if(room_id)
            {
                io.to(room_id).emit('broadcast', {name: name, data: worldData});
            }
            else
                socket.emit("InvalidStateError", "No Room_ID");
        };
        socket.on('room', function(id){
            room_id = id;
            socket.join(room_id);

            if(!(room_id in rooms))
            {
                rooms[room_id] = new World(broadcast);
                console.log('created room', room_id);
            }
            socket.room = rooms[room_id];

            socket.emit('broadcast', {name: 'resetTo', data: JSON.stringify(socket.room.getBodies())});
        });
        socket.on('addBody', function(data){
            console.log("addbody");
            socket.room.emit('addBody', data);
        });
        socket.on('updateBody', function(data){
            console.log("updatebody");
            socket.room.emit('updateBody', data);
        });
        socket.on('disconnect', function(){
            console.log("disconnect");
        })

    });

});
console.log("Listening on port " + port);
