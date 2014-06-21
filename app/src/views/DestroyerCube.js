/* This view is to create the destroyer cube*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var CubeView      = require('views/CubeView');

  function DestroyerCube() {
    View.apply(this, arguments);
    
    // Save position for easy access
    this.position = this.options.startPosition;
    // Retain mouse data to determine the cube movement
    this.downData = undefined;
    this.upData = undefined;

    _createDestroyer.call(this);
    _setMovementListeners.call(this);
  }

  DestroyerCube.prototype = Object.create(View.prototype);
  DestroyerCube.prototype.constructor = DestroyerCube;

  // Set destroyer cube default options
  DestroyerCube.DEFAULT_OPTIONS = {
    size: 100,
    startPosition: [150,150,150],
    color: 'blue'
  };

  // Position setter to relocate destroyer cube
  DestroyerCube.prototype.setPosition = function(pos){
    this.position = pos;
  };

  // Create Destroyer Cube
  function _createDestroyer () {
    var destroyerCube = new CubeView({ size: this.options.size });

    // Set CSS property on each side of the destroyer cube
    for (var i=0;i<destroyerCube.surfaces.length;i++) {
      destroyerCube.surfaces[i].setProperties({
        backgroundColor: this.options.color,
        opacity: 0.25,
        pointerEvents: 'auto'
      });
    }

    // create destroyer cube modifier in order to transition the location of the cube
    var destroyerModifier = new Modifier({
      transform: function () {
        return Transform.translate(this.position[0], this.position[1], this.position[2]);
      }.bind(this)
    });

    // save a reference to the dstroyer cube
    this.destroyerCube = destroyerCube;

    this.add(destroyerModifier).add(this.destroyerCube);
  }

  // Listen to the mouse movement on the destroyer cube and emit event which will 
  // include the direction that the cube should move
  function _setMovementListeners () {
    var movement;
    for (var i=0;i<this.destroyerCube.surfaces.length;i++) {
      // Listen for mouse down event and save data
      this.destroyerCube.surfaces[i].on('mousedown', function (data) {
        this.downData = data;
      }.bind(this));
      // listen on mouse up even and save data in order to determine the diff
      // between mouse down and up
      // emit the event along with the direction
      this.destroyerCube.surfaces[i].on('mouseup', function (data) {
        this.upData = data;
        movement = _calculateMovement(this.downData, this.upData);
        this._eventOutput.emit('movingCubeToGB', movement);
      }.bind(this));
    }
  }
  
  // Use the delta mouse movement to determine the direction that the destroyer cube
  // should move
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
