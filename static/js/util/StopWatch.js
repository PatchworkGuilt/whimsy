define( function() {
    var constructor = function StopWatch(name, logEveryN) {
        this.name = name;
        this.logEveryN = logEveryN;
        var elapsedTime = 0;
        var numMeasurements = 0;
        var startTime;

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
    }
    return constructor;
});
