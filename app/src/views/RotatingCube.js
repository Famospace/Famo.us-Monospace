define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var MouseSync      = require('famous/inputs/MouseSync');

    var CubeView = require('views/CubeView');
    var DestroyerCube = require('views/DestroyerCube');

    function RotatingCube() {
        View.apply(this, arguments);

        this.position = [0, 0];
        
        _createRotateModifier.call(this);
        _createBackground.call(this);
        _setBackgroundListeners.call(this);
        _createParentCube.call(this);
        _createDestroyerCube.call(this);
    }

    RotatingCube.prototype = Object.create(View.prototype);
    RotatingCube.prototype.constructor = RotatingCube;

    RotatingCube.DEFAULT_OPTIONS = {};

    function _createDestroyerCube () {
        var destroyerCube = new DestroyerCube();
        this.node.add(destroyerCube);
    }

    function _createParentCube () {
        this.cube = new CubeView();

        for (var j=0;j<this.cube.surfaces.length;j++) {
            this.cube.surfaces[j].setProperties({pointerEvents: 'none'});
        }

        this.node.add(this.cube);
    }

    function _createBackground () {
        this.backgroundSurface = new Surface({
            size: [undefined, undefined]
        });

        this.add(this.backgroundSurface);
    }

    function _createRotateModifier () {
        var self = this;
        var rotateModifier = new Modifier({
            transform: function () {

                return Transform.rotate(self.position[1]/100, self.position[0]/100, 0);

            }
        });

        this.node = this.add(rotateModifier);
    }

    function _setBackgroundListeners () {
        var ParentCubeSync = new MouseSync();

        this.backgroundSurface.pipe(ParentCubeSync);

        ParentCubeSync.on('update', function (data) {
            this.position[0] += data.delta[0];
            this.position[1] -= data.delta[1];
        }.bind(this));
    }

    module.exports = RotatingCube;


});
