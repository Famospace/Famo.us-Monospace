define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var MouseSync      = require('famous/inputs/MouseSync');
    var Transitionable = require('famous/transitions/Transitionable');

    var CubeView = require('views/CubeView');

    function RotatingCube() {
        View.apply(this, arguments);


        var backgroundSurface = new Surface({
            size: [undefined, undefined]
        });

        var sync = new MouseSync();

        backgroundSurface.pipe(sync);

        this.add(backgroundSurface);

        var position = [0, 0];

        sync.on('update', function (data) {
            position[0] += data.delta[0];
            position[1] -= data.delta[1];
        });

        var rotateModifier = new Modifier({
            transform: function () {
                var trans = Transform.rotate(position[1]/100, position[0]/100, 0);
                return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
            }
        });

        var node = this.add(rotateModifier);

        var smallCube = new CubeView({ size: 50 });

        var smallCubeModifier = new Modifier({
            transform: Transform.translate(150, 150, 150)
        });

        smallCube.pipe(sync);
        
        node.add(smallCubeModifier).add(smallCube);

        var cube = new CubeView();

        node.add(cube);

    }

    RotatingCube.prototype = Object.create(View.prototype);
    RotatingCube.prototype.constructor = RotatingCube;

    RotatingCube.DEFAULT_OPTIONS = {};

    module.exports = RotatingCube;
});
