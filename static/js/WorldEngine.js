if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['PhysicsJS', '../JSON/world.json'], function(Physics, worldData) {
    var constructor = function WorldEngine(timestep, render, room_id)
    {
        var worldPhysics = Physics({
            // maximum number of iterations per step
            maxIPF: 320,
            // set the integrator (may also be set with world.add())
            integrator: 'verlet'
            },
            createWorld
        );

        var getBodyJSON = function(body){
            return {
                x: body.state.pos._[0],
                y: body.state.pos._[1],
                radius: body.radius
            }
        };

        var toJSON = function(){
            var worldJSON = []
            worldPhysics._bodies.forEach(function(body)
            {
                worldJSON.push(getBodyJSON(body));
            });
            return JSON.stringify(worldJSON);
        };

        function createWorld(world){
            worldData.bodies.forEach(function(body){
                world.add(Physics.body(body.type, body.args))
            });
            worldData.behaviors.forEach(function(behavior){
                var args = behavior.args;
                if(behavior.args && behavior.args.aabb)
                    args['aabb'] = Physics.aabb.apply(this, behavior.args.aabb)
                if(args)
                    world.add( Physics.behavior(behavior.type, args))
                else
                    world.add( Physics.behavior(behavior.type))
            });

            world.on('addBody', function(object){
                var body = Physics.body(object.type, {x: object.x, y: object.y, radius: object.radius});
                world.add(body);
            });
            setInterval(function(){
                worldPhysics.step( Date.now() );
                render(room_id, toJSON());
            }, timestep);

        };
        this.emit = function(name, data){
            worldPhysics.emit(name, data);
        };
    }
    return constructor;
});
