if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function() {
    var things = {
        circle: {
            init: function(x,y) {
                return {
                    type: "circle",
                    x: x,
                    y: y,
                    radius: Math.floor(Math.random()*20 + 1)
                }
            },
            draw: function(thing, paper) {
                return paper.circle(thing.x, thing.y, thing.radius);
            }
        },
        rect: {
            init: function(x,y){
                return {
                    type: "rect",
                    x: x,
                    y: y,
                    width: 10,
                    height: 10
                }
            },
            draw: function(thing, paper) {
                return paper.rect(thing.x, thing.y, thing.width, thing.height);
            }
        }
    }
    return {
        getThing: function(thingName, x, y){
            return new things[thingName].init(x, y);
        },
        drawThing: function(thing, paper){
            return things[thing.type].draw(thing, paper);
        }
    }
});
