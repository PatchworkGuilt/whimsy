if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['World', 'socketio'], function(World, socketio){
    var proxy;
    var serverURL;
    var runningLocally;
    var broadcast;

    function init(broadcastFunction)
    {
        broadcast = broadcastFunction;
        runningLocally = true;
        runLocally();
        serverURL = typeof document != "undefined"? document.URL: "testURL";
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
        if(proxy && proxy.removeListener)
            proxy.removeListener("render");
        proxy = new World(broadcast, "room1");
        runningLocally = true;
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

    function initSocket() {
        var socket = socketio.connect(serverURL);

        socket.on('broadcast', function(data){
            console.log("broadcast");
            broadcast(data.name, data.data);
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
        isRunningLocally: isRunningLocally,
        init: init,
        setProxy: setProxy,
        getProxy: getProxy
    }
});
