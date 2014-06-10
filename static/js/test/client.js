var Browser = require("zombie");
var assert = require("assert");

describe("Clientside Integration Test", function(){
    var browser;
    before(function(done) {
        browser = new Browser();
        /*browser.on("error", function(error) {
          console.error(error);
        })*/
        browser
        .visit("http://localhost:3700/", { debug: true})
        .then(done, done);
    });
    it("works",function(done){
        assert.ok(browser.success);
        assert.equal(browser.errors.length, 0);
        browser.wait(function(){return browser.window.paper;});//, function(){
        browser.window.$('svg').click();
            //console.log(browser.window.$("circle"));
        console.log(browser.window.document.URL);
        assert.equal(browser.window.$("circle").length, 1);
        done();
        //});
    })
})
