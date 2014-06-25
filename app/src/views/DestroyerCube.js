/* This view is to create the destroyer cube*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var CubeView      = require('views/CubeView');
  var MouseSync     = require('famous/inputs/MouseSync');
  var TouchSync     = require('famous/inputs/TouchSync');

  function DestroyerCube() {
    View.apply(this, arguments);
    
    // Save position for easy access
    this.position = this.options.startPosition;
    // Retain mouse data to determine the cube movement
    this.posData = undefined;

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

    var mouseSync = new MouseSync();
    var touchSync = new TouchSync();

    mouseSync.on('start', function (data) {
      // initialize pos data
      this.posData = {x:0, y:0};
    }.bind(this));

    mouseSync.on('update', function (data) {
      //update x, y position
      this.posData.x += data.delta[0];
      this.posData.y += data.delta[1];
    }.bind(this));

    mouseSync.on('end', function () {
      // calculate total movement to determin up/down/right/left and emit movement event
      movement = _calculateMovement(this.posData);
      this._eventOutput.emit('movingCubeToGB', movement);
    }.bind(this));

    touchSync.on('start', function (data) {
      // initialize pos data
      this.posData = {x:0, y:0};
    }.bind(this));

    touchSync.on('update', function (data) {
      //update x, y position
      this.posData.x += data.delta[0];
      this.posData.y += data.delta[1];
    }.bind(this));

    touchSync.on('end', function () {
      // calculate total movement to determin up/down/right/left and emit movement event
      movement = _calculateMovement(this.posData);
      this._eventOutput.emit('movingCubeToGB', movement);
    }.bind(this));

    for (var i=0;i<this.destroyerCube.surfaces.length;i++) {
      //pipe sync events to each cube surface
      this.destroyerCube.surfaces[i].pipe(mouseSync);
      this.destroyerCube.surfaces[i].pipe(touchSync);
    }
  }
  
  // Use the delta mouse movement to determine the direction that the destroyer cube
  // should move
  function _calculateMovement (posData) {
    var xDelta = Math.abs(posData.x);
    var yDelta = Math.abs(posData.y);
    var output = [0,0];
    if (xDelta > 5 || yDelta > 5) { // mouse must move at least 5 px
      // vertical
      if (yDelta > xDelta) { //more y movement than x
        // move up
        if (posData.y < 0) output = [0,1];
        // move down
        if (posData.y > 0) output = [0,-1];
      // horizontal
      } else { //more x movement than y
        // move left
        if (posData.x < 0) output = [-1,0];
        // move right
        if (posData.x > 0) output = [1,0];
      }
    }
    return output;
  }

  module.exports = DestroyerCube;
});
