var assert = require("assert");
var requirejs = require("requirejs");

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['../../../util/StopWatch'], function(StopWatch){
    describe('StopWatch', function(){
        it("initializes its values", function(){
            var stopwatch = new StopWatch("test", 100);
            assert.equal(stopwatch.name, "test");
            assert.equal(stopwatch.logEveryN, 100);
        });

        it("calls log every logEveryN measurements", function(){
            var stopwatch = new StopWatch("test", 2);
            var calledCount = 0;
            stopwatch.log = function(){
                calledCount++;
            }
            stopwatch.startClock();
            stopwatch.stopClock();
            assert.equal(calledCount, 0);
            stopwatch.startClock();
            stopwatch.stopClock();
            assert.equal(calledCount, 1);
        });
    });
});
