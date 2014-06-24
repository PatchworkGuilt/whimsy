if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function() {
    var constructor = function(render, room_id)
    {
        var bodies = [];
        var bodyLookupTable = {};

        this.emit = function(name, data){
            switch(name){
                case 'addBody':
                    bodies.push(data);
                    render(JSON.stringify(bodies));
                    break;
            }
        };

        this.getBodies = function(){
            return bodies;
        }
    }
    return constructor;
});
