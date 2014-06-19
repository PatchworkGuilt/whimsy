if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['World', 'socketio'], function(World, socketio){
    var proxy;
    var serverURL;
    var renderCallback;

    //Using this redirection allows us to asynchronously change where we
    //handle the 'render' by changing renderCallback
    function render(data){
        renderCallback(data);
    }

    function init(render)
    {
        renderCallback = render;
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
        proxy = new World(render, "room1");
        proxy.start();
    }

    function runOnServer() {
        if(proxy && proxy.stop)
            proxy.stop();
        proxy = initSocket();
    }

    function isRunningLocally(){
        if(proxy && proxy.stop)
            return true;
        else
            return false;
    }

    function add(data) {
        proxy.emit('addBody', data);
    }

    function initSocket() {
        var socket = socketio.connect(serverURL);

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
