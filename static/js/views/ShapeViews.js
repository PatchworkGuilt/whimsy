define(['backbone', 'models/ShapeModels'], function(Backbone, ShapeModels) {
    var ShapeView = Backbone.View.extend({
        initialize: function(){},
        addListeners: function(){
            addDrag(this);
            addClick(this);
        },

        drawAsSelected: function(){
            bbox = this.drawnShape.getBBox();
            rect = this.paper.rect(bbox.x - 5, bbox.y - 5, bbox.width + 10, bbox.height + 10)
            this.whenSelected = rect;
        },

        render: function() {
            if(!this.drawnShape)
            {
                loc = this.getCurrentLocation()
                this.drawnShape = this.drawShape(loc.x, loc.y);
                this.addListeners();
            }
            else
            {
                this.updateShape();
            }
            this.drawnShape.toFront();
            if(this.whenSelected)
            {
                this.whenSelected.remove();
                this.whenSelected = null;
            }
            if(this.model.get('isSelected'))
                this.drawAsSelected()
        },

        updateShape: function() {
            var json = this.getShapeJSON();
            this.drawnShape.attr(json);
        },

        getShapeJSON: function() {
            return this.model.toJSON();
        },

        getCurrentLocation: function() {
            return {x: this.model.get('x'), y: this.model.get('y')}
        }
    });

    var RectangleView = ShapeView.extend({
        initialize: function(options, paper){
            this.paper = paper;
            this.model = new ShapeModels.RectangleModel(options);
            this.model.on("change", _.bind(this.render, this));
        },

        drawShape: function(x, y){
            return this.paper.rect(x, y, this.model.get('width'), this.model.get('height')).attr(this.model.getAttributes());
        },

        getCurrentLocation: function() {
            return this.model.getTopLeftCorner();
        },

        getShapeJSON: function() {
            topLeft = this.model.getTopLeftCorner();
            var modelJSON = this.model.toJSON();
            modelJSON['x'] = topLeft.x;
            modelJSON['y'] = topLeft.y;
            return modelJSON;
        }

    });

    var CircleView = ShapeView.extend({
        initialize: function(options, paper){
            this.paper = paper;
            this.model = new ShapeModels.CircleModel(options);
            this.model.on("change", _.bind(this.render, this));
        },

        drawShape: function(x,y){
            return this.paper.circle( x, y, this.model.get('radius')).attr(this.model.getAttributes());
        }

    });

    var SVGView = ShapeView.extend({
        initialize: function(options, paper) {
            this.paper = paper;
            this.model = new ShapeModels.SVGModel(options);
            this.model.on("change", _.bind(this.render, this));
        },

        getCurrentLocation: function() {
            var offset = {x: 0, y:0}
            if (this.model.has('centerOffset'))
                offset = this.model.get('centerOffset');
            return {
                x: this.model.get('x') + offset.x,
                y: this.model.get('y') + offset.y
            }
        },

        drawShape: function(x,y){
            var path = this.paper.path(this.model.get("path")).attr(this.model.getAttributes());
            this.updateScale(path);
            this.updateShape(path);
            return path;
        },

        updateScale: function(path) {
            var bbox = path.getBBox();
            var width = this.model.get('width'),
                height = this.model.get('height');
            var scale = {x: width / bbox.width, y: height / bbox.height};
            this.model.set('scale', scale);
        },

        updateShape: function(path) {
            var path = path || this.drawnShape;
            var scale = this.model.get('scale');
            var loc = this.getCurrentLocation()
            path = path.transform("s" + scale.x + "," + scale.y + "T" + loc.x + "," + loc.y);
        }
    });


    function addDrag(shape){
        var didDrag = false;
        function start() {
            shape.startX = shape.model.get('cx') || shape.model.get('x');
            shape.startY = shape.model.get('cy') || shape.model.get('y');
            shape.model.select();
        };
        function move(dx,dy, x, y) {
            shape.model.setLocation(shape.startX + dx, shape.startY + dy);
            didDrag = true;
        };
        function stop() {
            if(didDrag)
            {
                didDrag = false;
                shape.model.trigger('drag:end');
            }
        };
        shape.drawnShape.drag(move, start, stop);
    }

    function addClick(shape) {
        shape.drawnShape.click(function(){
            shape.model.select();
        })
    }

    return {
        ShapeView: ShapeView,
        RectangleView: RectangleView,
        CircleView: CircleView,
        SVGView: SVGView
    }
});
