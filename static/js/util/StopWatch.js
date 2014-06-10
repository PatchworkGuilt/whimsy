if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define( function() {
    var constructor = function StopWatch(name, logEveryN) {
        this.name = name;
        this.logEveryN = logEveryN;
        var elapsedTime = 0;
        var numMeasurements = 0;
        var startTime;

        var numFrames = 0;
        this.startClock = function(){
            startTime = Date.now();
        }
        this.stopClock = function(){
            elapsedTime += Date.now() - startTime;
            numMeasurements += 1
            if (this.logEveryN && numMeasurements % this.logEveryN == 0)
            {
                this.log();
            }
        }
        this.log = function(){
            console.log("\nRan " + numMeasurements + " " + this.name + " measurements in " + elapsedTime);
            console.log("Avg: " + elapsedTime / numMeasurements + " ms.");
            elapsedTime = 0;
            numMeasurements = 0;
        }

        this.tickFrame = function(){
            numFrames++;
        }

        this.logFPS = function(interval){
            interval = interval || 10000;
            setInterval(function(){
                console.log( (numFrames/(interval * 1000)) + ' per second');
                numFrames = 0;
            }, interval);
        }

    }
    return constructor;
});
