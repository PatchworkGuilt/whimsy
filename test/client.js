var requirejs = require("requirejs");
var assert = require("assert");

requirejs.config({
    baseUrl: './static',
    nodeRequire: require,
});

describe('WorldEngine', function(){
    var render;
    var worldEngine;
    beforeEach(function(done){
        requirejs(['js/WorldEngine'], function(WorldEngine){
            worldEngine = WorldEngine;
            done();
        });
    })
    describe('constructor', function(){
        it('like, works and stuff', function(){
            render = function(){};
            var world = new worldEngine(render, 'abc');
            assert(world.start);
        });
    });
});

