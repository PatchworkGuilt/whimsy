if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['./third-party/physicsjs-full-0.6.0', 'util/StopWatch'], function(Physics, StopWatch) {
    var constructor = function(render, room_id)
    {
        var FPS = 60.0;
        var timestep = 1000 / FPS;
        var renderInterval;

        //BECAUSE I NO HAVE DB YET
        var worldData = {
            "id": "world1",
            "height": 400,
            "width": 800,
            'bodies': [],
            "behaviors": [
                {
                    "type": "constant-acceleration"
                },
                {
                    "type": "edge-collision-detection",
                    "args": {
                        "aabb": [0,0,800,400],
                        "restitution": 0.3
                    }
                },
                {
                    "type": "body-impulse-response"
                },
                {
                    "type": "body-collision-detection"
                },
                {
                    "type": "sweep-prune"
                }
            ]
        };

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
        };

        this.start = function() {
            //var stopwatch = new StopWatch('step&render', 600);
            renderingInterval = setInterval(function(){
                //stopwatch.startClock();
                worldPhysics.step( Date.now() );
                render(toJSON());
                //stopwatch.stopClock();
            }, timestep);
        }

        this.stop = function(){
            window.clearInterval(renderingInterval);
        }

        this.emit = function(name, data){
            worldPhysics.emit(name, data);
        };
    }
    return constructor;
});
