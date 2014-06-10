define(['World', 'socketio'], function(World, socketio){
    var forwardToServer = false;
    var socket;
    var world;
    var renderCallback = function(){}; //Placeholder, gets overwritten in setRender
    function render(data){
        renderCallback(data);
        //To be overridden by client
    }

    function runLocally() {
        forwardToServer = false;
        if(socket)
            socket.removeListener("render");
        world = new World(render, "room1");
        world.start();
    }

    function runOnServer() {
        forwardToServer = true;
        if(world)
            world.stop();
        initSocket();
    }

    function isRunningLocally(){
        return !forwardToServer;
    }

    function add(data) {
        if(forwardToServer)
            socket.emit('add', data);
        else
            world.emit('addBody', data);
    }

    function setRender(callback) {
        renderCallback = callback;
    }

    function initSocket() {
        socket = socketio.connect(document.URL);

        socket.on('render', render);

        socket.on('disconnect', function () {
            console.log("What happen?");
        });
        socket.on('reconnecting', function () {
            console.log("Come back!");
        });
        socket.on('reconnect_failed', function () {
            console.log("Fuck.");
        });
    }

    return {
        runLocally: runLocally,
        runOnServer: runOnServer,
        add: add,
        isRunningLocally: isRunningLocally,
        setRender: setRender
    }
});
