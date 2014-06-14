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

        var largeCubeSync = new MouseSync();
        var smallCubeSync = new MouseSync();

        backgroundSurface.pipe(largeCubeSync);

        this.add(backgroundSurface);

        var position = [0, 0];
        var smallPosition = [150, 150, 150];
        var smallPositionXY = [3, 3];

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
            smallCube.surfaces[i].setProperties({ backgroundColor: 'blue', opacity: 0.25 });
            smallCube.surfaces[i].setContent('');
            _setMovementListeners(smallCube.surfaces[i]);
        }

        function _setMovementListeners (surface) {
            var downData, upData;
            surface.on('mousedown', function (data) {
                downData = data;
            });
            surface.on('mouseup', function (data) {
                upData = data;
                _moveSmallCube(downData, upData);
            });
        }

        function _moveSmallCube (downData, upData) {
            var xDelta = Math.abs(downData.x - upData.x);
            var yDelta = Math.abs(downData.y - upData.y);
            if (xDelta > 1 || yDelta > 1) {
                // vertical
                if (yDelta > xDelta) {
                    // move up
                    if (downData.y - upData.y > 0 && smallPositionXY[1] > 0) {
                        smallPositionXY[1]--;
                        smallPosition[1] -= 100;                     
                    } 
                    // move down
                    if (downData.y - upData.y < 0 && smallPositionXY[1] < 3) {
                        smallPositionXY[1]++;
                        smallPosition[1] += 100;                           
                    }
                // horizontal
                } else {
                    // move left
                    if (downData.x - upData.x > 0 && smallPositionXY[0] > 0) {
                        smallPositionXY[0]--;
                        smallPosition[0] -= 100;                           
                    }
                    // move right
                    if (downData.x - upData.x < 0 && smallPositionXY[0] < 3) {
                        smallPositionXY[0]++;
                        smallPosition[0] += 100;
                    }
                }
            }
        }
        
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
