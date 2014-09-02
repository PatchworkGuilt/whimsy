define(['backbone'], function(Backbone) {
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
            var coord = {};
            coord['x'] = this.get('x') - (this.get('width') / 2.0);
            coord['y'] = this.get('y') - (this.get('height') / 2.0);
            return coord;
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

    var ShapeCollection = Backbone.Collection.extend({
        model: ShapeModel
    });

    return {
        ShapeModel: ShapeModel,
        CircleModel: CircleModel,
        RectangleModel: RectangleModel,
        ImageModel: ImageModel,
        ShapeCollection: ShapeCollection
    };
});
