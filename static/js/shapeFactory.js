if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['backbone', 'views/ShapeViews'], function(Backbone, ShapeViews) {
    var paper = null;

    this.createNew = function(thingName, x, y){
        var viewData = {x: x, y: y};
        var shape = buildNewShape(thingName, viewData);
        return shape;
    };

    this.createNewFromData = function(data) {
        var shape = buildNewShape(data.type, data);
        return shape;
    };

    function buildNewShape(name, data)
    {
       switch(name)
        {
            case 'circle':
                return new ShapeViews.CircleView(data, paper);
            case 'rect':
                return new ShapeViews.RectangleView(data, paper);
            case 'owl':
                return new ShapeViews.ImageView(data, paper);
            default:
                console.error("Unknown shape: ", name);
        }
    }

    this.setPaper = function(p){
        paper = p;
    }
    return this;
});
