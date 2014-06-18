define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier       = require('famous/core/Modifier');


    var CubeView = require('views/CubeView');

    function DestroyerCube() {
        View.apply(this, arguments);

        this.position = this.options.position;
        this.positionXY = [3, 3];
        this.downData = undefined;
        this.upData = undefined;

        _createDestroyer.call(this);
        _setMovementListeners.call(this);
    }

    DestroyerCube.prototype = Object.create(View.prototype);
    DestroyerCube.prototype.constructor = DestroyerCube;

    DestroyerCube.DEFAULT_OPTIONS = {
        position: [150, 150, 150]
    };

    function _createDestroyer () {
        var destroyerCube = new CubeView({ size: 50 });

        for (var i=0;i<destroyerCube.surfaces.length;i++) {
            destroyerCube.surfaces[i].setProperties({ backgroundColor: 'blue', opacity: 0.25 });
            destroyerCube.surfaces[i].setContent('');
        }

        var destroyerModifier = new Modifier({
            transform: function () {
                return Transform.translate(this.position[0], this.position[1], this.position[2]);
            }.bind(this)
        });

        this.destroyerCube = destroyerCube;

        this.add(destroyerModifier).add(this.destroyerCube);

    }

    function _setMovementListeners () {
        for (var i=0;i<this.destroyerCube.surfaces.length;i++) {
            this.destroyerCube.surfaces[i].on('mousedown', function (data) {
                this.downData = data;
            }.bind(this));
            this.destroyerCube.surfaces[i].on('mouseup', function (data) {
                this.upData = data;
                _moveSmallCube(this.downData, this.upData, this.positionXY, this.position);
            }.bind(this));
        }
    }

    function _moveSmallCube (downData, upData, positionXY, position) {
        var xDelta = Math.abs(downData.x - upData.x);
        var yDelta = Math.abs(downData.y - upData.y);
        if (xDelta > 1 || yDelta > 1) {
            // vertical
            if (yDelta > xDelta) {
                // move up
                if (downData.y - upData.y > 0 && positionXY[1] > 0) {
                    positionXY[1]--;
                    position[1] -= 100;                     
                } 
                // move down
                if (downData.y - upData.y < 0 && positionXY[1] < 3) {
                    positionXY[1]++;
                    position[1] += 100;                           
                }
            // horizontal
            } else {
                // move left
                if (downData.x - upData.x > 0 && positionXY[0] > 0) {
                    positionXY[0]--;
                    position[0] -= 100;                           
                }
                // move right
                if (downData.x - upData.x < 0 && positionXY[0] < 3) {
                    positionXY[0]++;
                    position[0] += 100;
                }
            }
        }
    }

    module.exports = DestroyerCube;
});
