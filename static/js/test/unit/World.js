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
            assert.equal(world.getBodies().length, 0);
        });
        describe("emit", function(){
            it('adds a body when "addBody" is emitted', function(){
                var render = function(){};
                var world = new World(render, 'test');
                var body = {
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.emit("addBody", body);
                assert.equal(world.getBodies().length, 1);
            });
            it("calls render when 'addBody' is emitted", function(done){
                var render = function(data){
                    assert.isString(data);
                    done();
                };
                var world = new World(render, 'test');
                var body = {
                    type: 'circle',
                    x: 12,
                    y: 15
                }
                world.emit("addBody", body);
            });
        });
    });
});
