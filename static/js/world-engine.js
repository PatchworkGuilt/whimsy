var Physics = require('physicsjs');
var events = require('events');

var FPS = 120.0;
var timestep = 1000 / FPS;

var world = Physics({
    timestep: timestep,
    // maximum number of iterations per step
    maxIPF: 320,
    // set the integrator (may also be set with world.add())
    integrator: 'verlet'
    },
    createWorld
);

function getBodyJSON(body){
    return {
        x: body.state.pos._[0],
        y: body.state.pos._[1],
        radius: body.options.radius
    }
};

function getWorldJSON(){
    var worldJSON = []
    for(var i=0; i<this._bodies.length; i++)
    {
        var body = this._bodies[i];
        worldJSON.push(getBodyJSON(body));
    }
    return JSON.stringify(worldJSON);
};

function createWorld(world){
    var ball = Physics.body('circle', {
        x: 50,
        y: 30,
        vx: 1.0, // velocity in x-direction
        vy: 0, // velocity in y-direction
        radius: 20
    });
    world.add( ball );
    world.add( Physics.behavior('constant-acceleration') );
    var bounds = Physics.aabb(0, 0, 500, 500);
    world.add( Physics.behavior('edge-collision-detection', {
        aabb: bounds
    }) );
    // ensure objects bounce when edge collision is detected
    world.add( Physics.behavior('body-impulse-response') );
    world.toJSON = getWorldJSON;
    world.eventEmitter = new events.EventEmitter;
    var totalTime = 0;
    setInterval(function(){
        world.step( totalTime );
        totalTime += timestep;
        world.eventEmitter.emit('tick');
    }, timestep);
};

module.exports = world
