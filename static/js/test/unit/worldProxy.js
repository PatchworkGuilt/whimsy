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

    var WorldMock = function(broadcast, room){
        this.broadcast = broadcast;
        this.room = room;
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
        assert.isTrue(worldProxy.isRunningLocally());
        worldProxy.runOnServer();
        assert.isFalse(worldProxy.isRunningLocally());
        worldProxy.runLocally();
        assert.isTrue(worldProxy.isRunningLocally());
    });

    describe("init", function(){
        it("creates a world with given broadcast function and a room id", function(){
            function broadcast(){
                this.name = "testbroadcast";
            }
            worldProxy.init(broadcast);
            assert.equal(broadcast.name, worldProxy.getProxy().broadcast.name);
            assert.isString(worldProxy.getProxy().room);
        })
    })

    describe("runLocally", function(){
        it("removes a render listener", function(done){
            worldProxy.runOnServer();
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
