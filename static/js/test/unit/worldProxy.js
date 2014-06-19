var assert = require("chai").assert;
var requirejs = require("requirejs");
requirejs.config({
    baseUrl: ".",
    paths: {
        'Squire': '././node_modules/squirejs/src/Squire'
    }
})
var Squire = requirejs("Squire");

var injector = new Squire();
describe('worldProxy', function(){
    var worldProxy;

    var WorldMock = function(render, room){
        this.render = render;
        this.room = room;
        this.stop = function(){};
        this.start = function(){};
    }
    var SocketMock = {
            on: function(){}
        }

    before(function(){
        injector.mock('World', WorldMock)
        .mock('socketio', {
            connect: function(){
                return SocketMock;
            }
        })
        .require([__dirname + '/../../worldProxy.js'], function(Proxy){
            worldProxy = Proxy;
            worldProxy.init();
        });
    })

    it('Defaults to running locally', function(){
        assert(worldProxy.isRunningLocally());
    });

    it("can switch between running locally and on server", function(){
        assert(worldProxy.isRunningLocally());
        worldProxy.runOnServer();
        assert.equal(worldProxy.isRunningLocally(), false);
        worldProxy.runLocally();
        assert(worldProxy.isRunningLocally());
    });

    describe("init", function(){
        it("creates a world with given render function and a room id", function(){
            function render(){
                this.name = "testRender";
            }
            worldProxy.init(render);
            assert.equal(render.name, worldProxy.getProxy().render.name);
            assert.isString(worldProxy.getProxy().room);
        })
    })

    describe("runLocally", function(){
        it("removes a render listener", function(done){
            var mockProxy = {
                removeListener: function(name){
                    assert.equal(name, "render");
                    done();
                }
            }
            worldProxy.setProxy(mockProxy);
            worldProxy.runLocally();
        });

        it("sets proxy to a new world object", function(){
            worldProxy.runLocally();
            assert.instanceOf(worldProxy.getProxy(),WorldMock);
        })
    });

    describe("runOnServer", function(){
        it("stops the proxy world if it has a stop method", function(done){
            var mockProxy = {
                stop: function(){
                    done();
                }
            }
            worldProxy.setProxy(mockProxy);
            worldProxy.runOnServer();
        })

        it("sets proxy to a socket object", function(){
            worldProxy.runOnServer();
            assert.equal(worldProxy.getProxy(), SocketMock);
        })
    })

    describe("add", function(){
        it("emits an 'addBody' event", function(done){
            worldProxy.setProxy({
                emit: function(name, data){
                    assert.equal(name, "addBody");
                    assert.equal(data, "testData");
                    done();
                }
            });
            worldProxy.add("testData");
        });
    })

    describe("isRunningLocally", function(){
        it("returns true if running locally", function(){
            worldProxy.runLocally();
            assert.isTrue(worldProxy.isRunningLocally());
        })
        it("returns false if running on server", function(){
            worldProxy.runOnServer();
            assert.isFalse(worldProxy.isRunningLocally());
        })
    });

    describe("setProxy and getProxy", function(){
        it("sets and returns the given proxy value", function(){
            worldProxy.setProxy("Test Proxy");
            assert.equal(worldProxy.getProxy(), "Test Proxy");
        })
    })
});
