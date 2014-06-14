define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var MouseSync      = require('famous/inputs/MouseSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var Timer          = require('famous/utilities/Timer');

    var CubeView = require('views/CubeView');

    function RotatingCube() {
        View.apply(this, arguments);


        var backgroundSurface = new Surface({
            size: [undefined, undefined]
        });

        var largeCubeSync = new MouseSync();
        var smallCubeSync = new MouseSync();

        backgroundSurface.pipe(largeCubeSync);

        this.add(backgroundSurface);

        var position = [0, 0];
        var smallPosition = [150, 150, 150];



        var rotateModifier = new Modifier({
            transform: function () {
                var trans = Transform.rotate(position[1]/100, position[0]/100, 0);
                return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
            }
        });

        var node = this.add(rotateModifier);

        var smallCube = new CubeView({ size: 50 });

        var smallCubeModifier = new Modifier({
            transform: function () {
                return Transform.translate(smallPosition[0], smallPosition[1], smallPosition[2]);
            }
        });

        for (var i=0;i<smallCube.surfaces.length;i++) {
            smallCube.surfaces[i].pipe(smallCubeSync);
            // smallCube.surfaces[i].on('mousedown', function (data) {

            // }.bind(this));
        }


        smallCubeSync.on('update', function (data) {
            var x = Math.abs(data.delta[0]);
            var y = Math.abs(data.delta[1]);
            if (x > y) {
                smallPosition[0] += data.delta[0];
            } else {
                smallPosition[1] += data.delta[1];
            }
        }.bind(this));

        
        node.add(smallCubeModifier).add(smallCube);



        largeCubeSync.on('update', function (data) {
            position[0] += data.delta[0];
            position[1] -= data.delta[1];
        });

        var cube = new CubeView();

        for (var j=0;j<cube.surfaces.length;j++) {
            cube.surfaces[j].setProperties({pointerEvents: 'none'});
        }

        node.add(cube);

    }

    RotatingCube.prototype = Object.create(View.prototype);
    RotatingCube.prototype.constructor = RotatingCube;

    RotatingCube.DEFAULT_OPTIONS = {};

    module.exports = RotatingCube;
});
