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
                    this.addBody(data);
                    break;
                case 'updateBody':
                    this.updateBody(data);
                    break;
                case 'selectBody':
                    this.selectBody(data);
            }
        };

        this.addBody = function(data) {
            var newID = generateUUID();
            data.id = newID;
            bodies[newID] = data;
            broadcast('add', JSON.stringify(data));
        };

        this.updateBody = function(data) {
            if(data.id)
            {
                bodies[data.id] = data;
                broadcast('update', JSON.stringify(data));
            }
        };

        this.selectBody = function(data) {
            broadcast('select', JSON.stringify(data));
        };

        this.getBodies = function(){
            return bodies;
        };

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
