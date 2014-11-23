define(['backbone', 'worldProxy'], function(Backbone, worldProxy) {
    var ShapeModel = Backbone.Model.extend({
        idAttribute: '_id',

        sync: function(method, model, options) {
            switch(method){
                case 'update':
                    worldProxy.update(model.toJSON());
                    break;
                case 'create':
                    worldProxy.add(model.toJSON());
                    break;
                default:
                    Backbone.sync.call(method, model, options);
            }
        },

        setLocation: function(x,y) {
            var updates = {
                "x": x,
                "cx": x,
                "y": y,
                "cy": y
            }
            if(this.doNotSync)
                this.set(updates);
            else
                this.save(updates);
        },

        getAttributes: function(){
            return this.get('attr');
        },

        setDefaults: function(defaults) {
            for(key in defaults)
            {
                if(!this.has(key))
                    this.set(key, defaults[key]);
            }
        },

        getScaleToSize: function(x, y, sizeX, sizeY) {
            return {x: sizeX/x, y: sizeY/y};
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
        },

        select: function() {
            this.trigger('clicked', this);
        }
    });

    var CircleModel = ShapeModel.extend({
        initialize: function(){
            this.setDefaults({
                type: 'circle',
                radius: 10,
                attr: {
                    fill: this.getPastelColor()
                }
            });
        }
    });

    var RectangleModel = ShapeModel.extend({
        initialize: function(){
            this.setDefaults({
                type: 'rect',
                height: 20,
                width: 20,
                attr: {
                    fill: this.getPastelColor()
                }
            });
        }
    });

    var SVGModel = ShapeModel.extend({
        initialize: function() {
            this.setDefaults({
                type: 'star',
                height: 30,
                width: 30,
                path: "M 29,7.441432952880859 34.30384063720703,22.699893951416016 50.4544677734375,23.02901840209961 37.581787109375,32.78839111328125 42.25959014892578,48.25025939941406 29,39.02342987060547 15.740406036376953,48.25025939941406 20.418212890625,32.78839111328125 7.545528411865234,23.02901840209961 23.696163177490234,22.699893951416016 29,7.441432952880859 34.30384063720703,22.699893951416016 z",
                centerOffset: {
                    x: -29,
                    y: -27.8
                },
                attr:{
                    "stroke-width": '5',
                    stroke: '#000000',
                    strokeWidth: '5',
                    strokecolor: '#000000',
                    fill: '#FF0000',
                    orient: 'point',
                    point: '5',
                    shape: 'star',
                    'stroke-opacity': '1'
                }
            });
        }
    });

    var ShapesCollection = Backbone.Collection.extend({
        model: ShapeModel,

        initialize: function(){
            this.on('clicked', this.onClicked);
        },

        onClicked: function(model) {
            prevSelected = this.where({'isSelected': true});
            for(var i=0; i<prevSelected.length; i++)
            {
                prev = prevSelected[i];
                if(prev.get('_id') != model.get('_id'))
                    prev.unset('isSelected');
            }
            model.set('isSelected', true);
        }

    });

    return {
        ShapeModel: ShapeModel,
        CircleModel: CircleModel,
        RectangleModel: RectangleModel,
        SVGModel: SVGModel,
        ShapesCollection: ShapesCollection
    };
});
