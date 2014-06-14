define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var MouseSync      = require('famous/inputs/MouseSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var Draggable      = require('famous/modifiers/Draggable');

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
            // smallCube.surfaces[i].pipe(smallCubeSync);
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
            if (xDelta > 10 || yDelta > 10) {
                // vertical
                if (yDelta > xDelta) {
                    // delta is positive
                    if (downData.y - upData.y > 0) {
                        smallPosition[1] -= 100;                           
                    } else {
                    // delta is negative
                        smallPosition[1] += 100;                           
                    }
                // horizontal
                } else {
                    // delta is positive
                    if (downData.x - upData.x > 0) {
                        smallPosition[0] -= 100;                           
                    } else {
                    // delta is negative
                        smallPosition[0] += 100;                           
                    }
                }
            }
        }

        /*
        Objective:
            assess trend of mouse-movement
                if (xDelta > yDelta)
                    isolate x-axis (aka prohibit y-axis translations)
                else
                    isolate y-axis (aka prohibit x-axis translations)

            What if:
                _____________
                |///////////|
                |//         |
                |//         |
                |//         |
                |//_________|

                when '/' area is reached (assuming start pointer coords are 
                    in center of cube), the cube starts *only* moving in that
                    direction
                  process
                    mousedown coords inside surface
                    move pointer to 'edge' of surface
                        direction is locked
                            mouse must still be down
                                maybe calculate slope to determine x/y axis

            if mouse approaches surface edge area:
                based on edge, cube moves in that direction by 1
        */


        // smallCubeSync.on('update', function (data) {
        //     var x = Math.abs(data.delta[0]);
        //     var y = Math.abs(data.delta[1]);
        //     console.log(data);
        //     if (x > y) {
        //         smallPosition[0] += data.delta[0];
        //     } else {
        //         smallPosition[1] += data.delta[1];
        //     }
        // }.bind(this));

        
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
