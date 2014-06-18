define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier      = require('famous/core/Modifier');
    var CubeView      = require('views/CubeView');

    function SmallCube() {
        View.apply(this, arguments);

        this.position = this.options.startPosition;

        _createSmallCube.call(this);
    }

    SmallCube.prototype = Object.create(View.prototype);
    SmallCube.prototype.constructor = SmallCube;

    SmallCube.prototype.setPosition = function(pos){
        this.position=pos;
    };

    SmallCube.DEFAULT_OPTIONS = {
        size: 100,
        startPosition: [-100, -100, 0],
        cubeColor: 'white'
    };

    function _createSmallCube () {
        var smallCube = new CubeView({ size: this.options.size });

        for (var i=0;i<smallCube.surfaces.length;i++) {
            smallCube.surfaces[i].setProperties({
                size: this.options.size,
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
