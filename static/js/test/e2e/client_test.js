function countCircles(){
    return document.querySelectorAll("circle").length;
};

function countRects(){
    return document.querySelectorAll("rect").length;
};
casper.on('remote.message', function(message) {
    this.echo(message);
});
casper.on("page.error", function(msg, trace) {
  this.echo("Error:    " + msg, "ERROR");
  this.echo("file:     " + trace[0].file, "WARNING");
  this.echo("line:     " + trace[0].line, "WARNING");
  this.echo("function: " + trace[0]["function"], "WARNING");
});

casper.test.begin("Page opens and can add shapes locally or to server", 5, function suite(test){
    casper.start("http://localhost:3700", function(){
        casper.waitForSelector("svg", function(){
            test.assertExists("svg", "Has an svg canvas");
        })
        casper.then(function(){
            var numCircles = this.evaluate(countCircles);
            test.assertEquals(numCircles, 0, "Initially there are no circles.");
        });
        casper.then(function(){
            this.click("svg");
        });
        casper.waitForSelector("circle", function(){
            var numCircles = this.evaluate(countCircles);
            test.assertEquals(numCircles, 1, "After clicking svg, there is one circle");
        });
        casper.then(function(){
            this.click("#runOnServer");
        });
        casper.wait(200, function(){
            var numCircles = this.evaluate(countCircles);
            test.assertEquals(numCircles, 0, "After switching to server, there are no circles.");
        })
        casper.then(function(){
            this.click("svg");
        });
        casper.waitForSelector("circle", function(){
            var numCircles = this.evaluate(countCircles);
            test.assertEquals(numCircles, 1, "After clicking svg, there is one circle");
        });

    });
    casper.run(function() {
        test.done();
    });
});
//Only passes when server is new, AND browser is also connected to server.  W. T. F.

casper.test.begin("Can add both circles and squares", 2, function suite(test){
    casper.start("http://localhost:3700", function(){
        var numCircles, numRectangles;
        casper.waitForSelector("svg");
        casper.then(function(){
            numCircles = this.evaluate(countCircles);
            numRectangles = this.evaluate(countRects);
        });
        casper.then(function(){
            this.click("#useCircle");
        });
        casper.wait(200, function(){
            this.click("svg");
        });
        casper.waitForSelector("circle", function(){
            var newNumCircles = this.evaluate(countCircles);
            test.assertEquals(newNumCircles, numCircles + 1, "After adding a circle, there is a new circle");
        });
        casper.then(function(){
            this.click("#useRect");
        });
        casper.wait(200, function(){
            this.click("svg");
        });
        casper.waitForSelector("rect", function(){
            var newNumRectangles = this.evaluate(countRects);
            test.assertEquals(newNumRectangles, numRectangles + 1, "After adding a rect, there is a new rect");
        });

    });
    casper.run(function() {
        test.done();
    });
});
