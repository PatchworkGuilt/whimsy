//Run with casper test client_test.js
casper.test.begin("Sandbox page opens and runs", 5, function suite(test){
    casper.start("http://localhost:3700", function(){
        casper.waitForSelector("svg", function(){
            test.assertExists("svg", "Has an svg canvas");
        })
        casper.then(function(){
            var numCircles = document.querySelectorAll("circle").length;
            test.assertEquals(numCircles, 0, "Initially there are no circles.");
        });
        casper.then(function(){
            this.click("svg");
        });
        casper.waitForSelector("circle", function(){
            var numCircles = this.evaluate(function(){
                return __utils__.findAll("circle").length;
             });
            test.assertEquals(numCircles, 1, "After clicking svg, there is one circle");
        });
        casper.then(function(){
            this.click("#toggleControl");
        })
        casper.then(function(){
            var numCircles = document.querySelectorAll("circle").length;
            test.assertEquals(numCircles, 0, "After switching to server, there are no circles.");
        })
        casper.then(function(){
            this.click("svg");
        });
        casper.waitForSelector("circle", function(){
            var numCircles = this.evaluate(function(){
                return __utils__.findAll("circle").length;
             });
            test.assertEquals(numCircles, 1, "After clicking svg, there is one circle");
        });

    });
    casper.run(function() {
        test.done();
    });
});
