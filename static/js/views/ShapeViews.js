define(['backbone', 'models/ShapeModels'], function(Backbone, ShapeModels) {
    var ShapeView = Backbone.View.extend({
        initialize: function(){},
        render: function(){}
    });

    var RectangleView = ShapeView.extend({
        initialize: function(options, paper){
            this.paper = paper;
            this.model = new ShapeModels.RectangleModel(options);
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
            return this.paper.rect(x, y, this.model.get('width'), this.model.get('height'));
        }
    });

    var CircleView = ShapeView.extend({
        initialize: function(options, paper){
            this.paper = paper;
            this.model = new ShapeModels.CircleModel(options);
            this.model.on("change", _.bind(this.render, this));
        },
        render: function(){
            if(!this.drawnShape)
            {
                this.drawnShape = this.paper.circle(this.model.get('x'), this.model.get('y'), this.model.get('radius'));
                addDrag(this);
            }
            else
                this.drawnShape.animate(this.model.toJSON());
            this.drawnShape.attr(this.model.getAttrKeys()).toFront();
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

    return {
        ShapeView: ShapeView,
        RectangleView: RectangleView,
        CircleView: CircleView,
        ImageView: ImageView
    }
});
