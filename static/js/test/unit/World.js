var assert = require("chai").assert;
var requirejs = require("requirejs");

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../World'], function(World){
    describe('World', function(){
        it("initially has no data", function(){
            var render = function(){};
            var world = new World(render, 'test');
            assert.deepEqual(world.getBodies(), {});
        });
        describe("addBody", function(){
            it('adds a body', function(){
                var render = function(){};
                var world = new World(render, 'test');
                var body = {
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.addBody(body);
                var bodies = world.getBodies();
                var count = 0;
                for(bodyID in bodies)
                {
                    count += 1;
                    assert.equal(bodies[bodyID].type, body.type);
                    assert.equal(bodies[bodyID].x, body.x);
                    assert.equal(bodies[bodyID].y, body.y);
                }
                assert.equal(count, 1);
            });
            it("calls broadcast", function(done){
                var broadcast = function(data){
                    assert.isString(data);
                    done();
                };
                var world = new World(broadcast, 'test');
                var body = {
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.addBody(body);
            });
        });
    });
});
