/* This view is to create small cubes that gets destroyed by the destroyer cube*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var CubeView      = require('views/CubeView');

  function SmallCube() {
    View.apply(this, arguments);
    
    // Store position for easy access
    this.position = this.options.startPosition;

    _createSmallCube.call(this);
  }

  SmallCube.prototype = Object.create(View.prototype);
  SmallCube.prototype.constructor = SmallCube;

  // To set absolute position of the big cube relative to the center of the cube,
  // by updating the transfom position on the cube's modifier
  SmallCube.prototype.setPosition = function(pos){
    this.position=pos;
  };

  // To get the absolute position relative to the center of the big cube
  SmallCube.prototype.getPosition = function(){
    return this.position;
  };

  // Set default options
  SmallCube.DEFAULT_OPTIONS = {
    size: 100,
    startPosition: [-150, -150, -150],
    cubeColor: 'white',
    opacity: 1
  };
  
  // create small cube
  function _createSmallCube () {
    var smallCube = new CubeView({ size: this.options.size });

    for (var i=0;i<smallCube.surfaces.length;i++) {
      smallCube.surfaces[i].setProperties({
        size: this.options.size,
        backgroundColor: this.options.cubeColor,
        opacity: this.options.opacity,
        pointerEvents: 'none'
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
