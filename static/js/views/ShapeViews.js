define(['backbone', 'models/ShapeModels'], function(Backbone, ShapeModels) {
    var ShapeView = Backbone.View.extend({
        initialize: function(){},
        render: function(){},
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
                this.addListeners(this);
            }
            else
            {
                var json = this.getShapeJSON();
                this.drawnShape.animate(json);
            }
            this.drawnShape.attr(this.model.getAttributes()).toFront();
            if(this.whenSelected)
            {
                this.whenSelected.remove();
                this.whenSelected = null;
            }
            if(this.model.get('isSelected'))
                this.drawAsSelected()
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
            return this.paper.rect(x, y, this.model.get('width'), this.model.get('height'));
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
            return this.paper.circle( x, y, this.model.get('radius'));
        }

    });

    var ImageView = RectangleView.extend({
        initialize: function(options, paper) {
            this.paper = paper;
            options['url'] = 'images/owl.jpeg';
            options['type'] = 'owl';
            this.model = new ShapeModels.ImageModel(options);
            this.model.on("change", _.bind(this.render, this));
        },
        drawShape: function(x,y){
            return this.paper.image(this.model.get("url"), x, y, this.model.get("width"), this.model.get("height"));
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
                dragStopTime = Date.now();
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
        ImageView: ImageView
    }
});
