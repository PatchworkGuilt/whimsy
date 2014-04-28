var Physics = require('PhysicsJS');
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
    this._bodies.forEach(function(body)
    {
        worldJSON.push(getBodyJSON(body));
    });
    return JSON.stringify(worldJSON);
};

function createWorld(world){
    var worldData = require('../JSON/world.json')
    worldData.bodies.forEach(function(body){
        world.add(Physics.body(body.type, body.args))
    });
    worldData.behaviors.forEach(function(behavior){
        var args;
        if(behavior.args && behavior.args.aabb)
            args = {'aabb': Physics.aabb.apply(this, behavior.args.aabb)}
        if(args)
            world.add( Physics.behavior(behavior.type, args))
        else
            world.add( Physics.behavior(behavior.type))
    });

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
