if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['backbone', 'worldProxy'], function(Backbone, worldProxy) {
    var paper = null;
    var ShapeModel = Backbone.Model.extend({
        initialize: function() {
            this.shapeAttrKeys = ['fill'];
        },
        setLocation: function(x,y) {
            this.set({"x": x, "cx": x});
            this.set({"y": y, "cy": y});
        },
        getAttrKeys: function(){
            var attrs = {}
            for(var i=0; i<this.shapeAttrKeys.length; i++)
            {
                var key = this.shapeAttrKeys[i];
                attrs[key] = this.get(key);
            }
            return attrs;
        },
        setDefaults: function(defaults) {
            for(key in defaults)
            {
                if(!this.has(key))
                    this.set(key, defaults[key]);
            }
        },
        getPastelColor: function() {
            var baseColor = [255, 255, 255];
            var colorString = "#";
            for(var i=0; i<3; i++)
            {
                var color = Math.floor((Math.random()*256 + baseColor[i]) / 2);
                colorString += color.toString(16);
            }
            return colorString;
        },
        getTopLeftCorner: function() {
            var centered = {};
            centered['x'] = this.get('x') - (this.get('width') / 2.0);
            centered['y'] = this.get('y') - (this.get('height') / 2.0);
            return centered;
        }
    });

    var CircleModel = ShapeModel.extend({
        initialize: function(){
            this.setDefaults({
                type: 'circle',
                radius: 10,
                fill: this.getPastelColor()
            });
            this.shapeAttrKeys = ['fill'];
        }
    });

    var RectangleModel = ShapeModel.extend({
        initialize: function(){
            this.setDefaults({
                type: 'rect',
                height: 20,
                width: 20,
                fill: this.getPastelColor()
            });
            this.shapeAttrKeys = ['fill'];
        }
    });

    var ImageModel = ShapeModel.extend({
        initialize: function() {
            this.setDefaults({
                type: 'image',
                height: 30,
                width: 30
            });
            this.shapeAttrKeys = [];
        }
    });

    var ShapeView = Backbone.View.extend({
        initialize: function(){},
        render: function(){}
    });

    var RectangleView = ShapeView.extend({
        initialize: function(options){
            this.model = new RectangleModel(options);
            this.model.on("change", _.bind(this.render, this));
        },
        render: function(){
            var topLeft = this.model.getTopLeftCorner();
            if(!this.drawnShape)
            {
                this.drawnShape = this.drawShape(topLeft.x, topLeft.y);
                addDrag(this);
            }
            else
            {
                var modelJSON = this.model.toJSON();
                modelJSON['x'] = topLeft.x;
                modelJSON['y'] = topLeft.y;
                this.drawnShape.animate(modelJSON);
            }
            this.drawnShape.attr(this.model.getAttrKeys(this.shapeAttrKeys)).toFront();
        },
        drawShape: function(x, y){
            return paper.rect(x, y, this.model.get('width'), this.model.get('height'));
        }
    });

    var Shapes = {};
    Shapes['circle'] = ShapeView.extend({
        initialize: function(options){
            this.model = new CircleModel(options);
            this.model.on("change", _.bind(this.render, this));
        },
        render: function(){
            if(!this.drawnShape)
            {
                this.drawnShape = paper.circle(this.model.get('x'), this.model.get('y'), this.model.get('radius'));
                addDrag(this);
            }
            else
                this.drawnShape.animate(this.model.toJSON());
            this.drawnShape.attr(this.model.getAttrKeys()).toFront();
        }

    });

    Shapes['rect'] = RectangleView;

    Shapes['owl'] = RectangleView.extend({
        initialize: function(options) {
            options['url'] = 'images/owl.jpeg';
            options['type'] = 'owl';
            this.model = new ImageModel(options);
            this.model.on("change", _.bind(this.render, this));
        },
        drawShape: function(x,y){
            return paper.image(this.model.get("url"), x, y, this.model.get("width"), this.model.get("height"));
        }
    })

    function addDrag(shape){
        var didDrag = false;
        function start() {
            shape.startX = shape.model.get('cx') || shape.model.get('x');
            shape.startY = shape.model.get('cy') || shape.model.get('y');
        };
        function move(dx,dy, x, y) {
            shape.model.setLocation(shape.startX + dx, shape.startY + dy);
            worldProxy.update(shape.model.toJSON());
            didDrag = true;
        };
        function stop() {
            if(didDrag)
            {
                dragStopTime = Date.now();
                didDrag = false;
                shape.model.trigger('drag:end');
            }
        };
        shape.drawnShape.drag(move, start, stop);
    }

    this.createNew = function(thingName, x, y){
        return new Shapes[thingName]({x: x, y: y});
    };

    this.createNewFromData = function(data) {
        var shape = new Shapes[data.type](data);
        return shape;
    };

    this.setPaper = function(p){
        paper = p;
    }
    return this;
});
