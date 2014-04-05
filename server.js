var express = require("express");
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
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat', timestamp: Date.now() });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);
