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
        describe("emit", function(){
            var world;
            before(function(){
                world = new World(null, 'test');
            })
            it('calls the "addBody" function on "addBody" event', function(done){
                var expectedData = {
                    type: 'circle',
                    x: 12,
                    y: 13
                };
                world.addBody = function(data){
                    assert.deepEqual(expectedData, data);
                    done();
                };
                world.emit('addBody', expectedData);
            });
            it('calls the "updateBody" function on "updateBody" event', function(done){
                var expectedData = {
                    type: 'circle',
                    x: 12,
                    y: 13
                };
                world.updateBody = function(data){
                    assert.deepEqual(expectedData, data);
                    done();
                };
                world.emit('updateBody', expectedData);
            });
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
                    var savedBody = bodies[bodyID];
                    assert.equal(savedBody.type, body.type);
                    assert.equal(savedBody.x, body.x);
                    assert.equal(savedBody.y, body.y);
                    assert.isString(savedBody.id);
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

        describe("updateBody", function(){
            it('updates a body', function(){
                var render = function(){};
                var world = new World(render, 'test');
                var body = {
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.addBody(body);
                var newBody = {
                    id: body.id, //added by reference in addBody
                    type: 'rect',
                    x: 20,
                    y: 11
                }
                world.updateBody(newBody);
                var bodies = world.getBodies();
                var count = 0;
                for(bodyID in bodies)
                {
                    count += 1;
                    var savedBody = bodies[bodyID];
                    assert.deepEqual(savedBody, newBody);
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
                    id: 'abc123',
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.updateBody(body);
            });
        });
    });
});
