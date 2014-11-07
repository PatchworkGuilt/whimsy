if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['util/db'], function(db) {
    var constructor = function(broadcast, roomId)
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
            var newID = db.getNewId();
            data._id = newID;
            bodies[newID] = data;
            broadcast('add', JSON.stringify(data));
            db.addShape(roomId, data);
        };

        this.updateBody = function(data) {
            if(data._id)
            {
                bodies[data._id] = data;
                broadcast('update', JSON.stringify(data));
                db.updateShape(roomId, data._id, data);
            }
        };

        this.selectBody = function(data) {
            broadcast('select', JSON.stringify(data));
        };

        this.getBodies = function(){
            return bodies;
        };
    }
    return constructor;
});
