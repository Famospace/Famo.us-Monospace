define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier      = require('famous/core/Modifier');
    var CubeView      = require('views/CubeView');

    function SmallCube() {
        View.apply(this, arguments);

        this.position = this.options.startPosition;

        _createWhiteCube.call(this);
    }

    SmallCube.prototype = Object.create(View.prototype);
    SmallCube.prototype.constructor = SmallCube;

    SmallCube.prototype.setPositio = function(pos){
        this.positon=pos;
    };

    SmallCube.DEFAULT_OPTIONS = {
        startPosition: [-100, -100, 0],
        cubeColor: 'white'
    };

    function _createWhiteCube () {
        var smallCube = new CubeView({ size: 50 });

        for (var i=0;i<smallCube.surfaces.length;i++) {
            smallCube.surfaces[i].setProperties({
                backgroundColor: this.options.cubeColor,
                opacity: 0.25
            });
        }

        var smallCubeModifier = new Modifier({
            transform: function () {
                return Transform.translate(this.position[0], this.position[1], this.position[2]);
            }.bind(this)
        });

        this.smallCube = smallCube;

        this.add(smallCubeModifier).add(this.smallCube);
    }

    module.exports = SmallCube;
});
