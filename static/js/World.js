if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function() {
    var constructor = function(broadcast, room_id)
    {
        var bodies = {};

        //Replicates the API of socketio so worldProxy can call local/server the same way
        this.emit = function(name, data){
            switch (name){
                case 'addBody':
                    var newID = generateUUID();
                    data.id = newID;
                    bodies[newID] = data;
                    broadcast('render', JSON.stringify(bodies));
                    break;
            }
        };

        this.getBodies = function(){
            return bodies;
        }

        function generateUUID(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return uuid;
        };
    }
    return constructor;
});
