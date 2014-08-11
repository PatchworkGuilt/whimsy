var assert = require("chai").assert;
var requirejs = require("requirejs");

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['../../shapeFactory'], function(shapeFactory){
    describe('shapeFactory', function(){
        describe("createNew", function(){
            it("returns a correct circle object", function(){
                var circle1 = shapeFactory.createNew("circle", 10, 15);
                var circle2 = shapeFactory.createNew("circle", 30, 40);

                assert.equal(circle1.x, 10);
                assert.equal(circle1.y, 15);
                assert.isNumber(circle1.radius);

                assert.equal(circle2.x, 30);
                assert.equal(circle2.y, 40);
                assert.isNumber(circle2.radius);
            });

            it("returns a correctly centered rect object", function(){
                var rect1 = shapeFactory.createNew("rect", 20, 30);
                var rect2 = shapeFactory.createNew("rect", 40, 30);

                assert.equal(rect1.x, 20);
                assert.equal(rect1.y, 30);
                assert.isNumber(rect1.width);
                assert.isNumber(rect1.height);

                assert.equal(rect2.x, 20);
                assert.equal(rect2.y, 15);
                assert.isNumber(rect2.width);
                assert.isNumber(rect2.height);
            });
        });
    });
});
