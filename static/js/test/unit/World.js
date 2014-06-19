var assert = require("assert");
var requirejs = require("requirejs");
requirejs.config({
    baseUrl: ".",
    paths: {
        'Squire': '././node_modules/squirejs/src/Squire'
    }
})
var Squire = requirejs("Squire");

var injector = new Squire();
describe('World', function(){
    it('like, works and stuff', function(){
        injector.mock('util/StopWatch', {})
        .require([__dirname + '/../../World.js'], function(World){
            var render = function(){};
            var world = new World(render, 'abc');
            assert(world.start);
        });
    });
});
