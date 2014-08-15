if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['shapeFactory'], function(shapeFactory) {
    var constructor = function(paper, shapesList, callback){
        var shapes = [];
        var CELL_HEIGHT = 40;
        var CELL_WIDTH = 40;
        var startPoint  = {x: 0, y: paper.height}

        for(var i=0; i<shapesList.length; i++)
        {
            var shapeName = shapesList[i];
            var shapeOrigin = {
                x: startPoint.x + (CELL_WIDTH * i),
                y: startPoint.y - CELL_HEIGHT
            }
            drawTool(shapeName, shapeOrigin.x, shapeOrigin.y);
        }

        function drawTool(name, x, y) {
            //Tool background
            paper.rect(x, y, CELL_WIDTH, CELL_HEIGHT)
                .attr({fill: 'gray'})
                .toBack();
            var startingLoc = {x: x + (CELL_WIDTH/2), y: y + (CELL_HEIGHT/2)};
            var shapeTemplate = shapeFactory.createNew(name, startingLoc.x, startingLoc.y);
            drawShapeEntry(shapeTemplate);
            shapeTemplate.model.on('drag:end', function(){
                callback("add", this.toJSON());
                drawShapeEntry(shapeTemplate);
            });

            function drawShapeEntry(shape) {
                shape.model.setLocation(startingLoc.x, startingLoc.y);
                shapeTemplate.render();
                //shapeTemplate.drawnShape.animate({x: x, y: y}, 1000);
            }
        }

    }

    return constructor;
});
