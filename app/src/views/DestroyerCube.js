define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier      = require('famous/core/Modifier');
    var CubeView      = require('views/CubeView');

    function DestroyerCube() {
        View.apply(this, arguments);

        this.position = this.options.startPosition;
        this.downData = undefined;
        this.upData = undefined;


        _createDestroyer.call(this);
        _setMovementListeners.call(this);
    }

    DestroyerCube.prototype = Object.create(View.prototype);
    DestroyerCube.prototype.constructor = DestroyerCube;

    DestroyerCube.DEFAULT_OPTIONS = {
        size: 100,
        startPosition: [150,150,150],
        color: 'blue'
    };

    DestroyerCube.prototype.setPosition = function(pos){
        this.position = pos;
    };

    function _createDestroyer () {
        var destroyerCube = new CubeView({ size: this.options.size });

        for (var i=0;i<destroyerCube.surfaces.length;i++) {
            destroyerCube.surfaces[i].setProperties({
                backgroundColor: this.options.color,
                opacity: 0.25 });
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
        var movement;
        for (var i=0;i<this.destroyerCube.surfaces.length;i++) {

            this.destroyerCube.surfaces[i].on('mousedown', function (data) {
                this.downData = data;
            }.bind(this));
            
            this.destroyerCube.surfaces[i].on('mouseup', function (data) {
                this.upData = data;
                movement = _calculateMovement(this.downData, this.upData);
                this._eventOutput.emit('movingCubeToGB', movement);
            }.bind(this));

            this.destroyerCube.surfaces[i].on('touchstart', function (data) {
                this.downData = {
                    x: data.changedTouches[0].clientX,
                    y: data.changedTouches[0].clientY
                };
            }.bind(this));

            this.destroyerCube.surfaces[i].on('touchend', function (data) {
                this.upData = {
                    x: data.changedTouches[0].clientX,
                    y: data.changedTouches[0].clientY
                };
                movement = _calculateMovement(this.downData, this.upData);
                this._eventOutput.emit('movingCubeToGB', movement);
                this.downData = undefined;
            }.bind(this));
        }
    }

    function _calculateMovement (downData, upData) {
        var xDelta = Math.abs(downData.x - upData.x);
        var yDelta = Math.abs(downData.y - upData.y);
        var output = [0,0];
        if (xDelta > 1 || yDelta > 1) {
            // vertical
            if (yDelta > xDelta) {
                // move up
                if (downData.y - upData.y > 0) {
                    output = [0,1];
                } 
                // move down
                if (downData.y - upData.y < 0) {
                    output = [0,-1]; 
                }
            // horizontal
            } else {
                // move left
                if (downData.x - upData.x > 0) {
                    output = [-1,0];                          
                }
                // move right
                if (downData.x - upData.x < 0) {
                    output = [1,0];
                }
            }
        }
        return output;
    }

    module.exports = DestroyerCube;
});
