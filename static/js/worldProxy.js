if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['socketio'], function(socketio){
    var proxy;
    var serverURL;
    var runningLocally;
    var broadcast;
    var room_id;

    function init(broadcastFunction)
    {
        broadcast = broadcastFunction;
        runningLocally = true;
        runOnServer();
        serverURL = window? window.location.host: undefined;
        room_id = window? window.location.pathname.split("/")[1]: undefined;
    }

    function setProxy(p)
    {
        proxy = p;
    }

    function getProxy()
    {
        return proxy;
    }

    function runLocally() {
        define(['World'], function(World){
            if(proxy && proxy.removeListener)
                proxy.removeListener("render");
            proxy = new World(broadcast);
            runningLocally = true;
        })
    }

    function runOnServer() {
        proxy = initSocket();
        runningLocally = false;
    }

    function isRunningLocally(){
        return runningLocally;
    }

    function add(data) {
        proxy.emit('addBody', data);
    }

    function update(data) {
        proxy.emit("updateBody", data);
    }

    function select(id) {
        proxy.emit("selectBody", id);
    }

    function initSocket() {
        var socket = socketio.connect(serverURL);
        window.socket = socket;

        socket.on('broadcast', function(data){
            console.log("broadcast");
            broadcast(data.name, data.data);
        })
        .on('connect', function(){
            console.log("Joined ", room_id);
            socket.emit('room', room_id);
        })
        .on('disconnect', function () {
            console.log("What happen?");
        })
        .on('reconnecting', function () {
            console.log("Come back!");
        })
        .on('reconnect_failed', function () {
            console.log("Fuck.");
        });


        return socket;
    }

    return {
        runLocally: runLocally,
        runOnServer: runOnServer,
        add: add,
        update: update,
        select: select,
        isRunningLocally: isRunningLocally,
        init: init,
        setProxy: setProxy,
        getProxy: getProxy
    }
});
