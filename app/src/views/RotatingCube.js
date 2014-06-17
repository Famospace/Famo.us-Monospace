define(function(require, exports, module) {
  var View           = require('famous/core/View');
  var Surface        = require('famous/core/Surface');
  var Transform      = require('famous/core/Transform');
  var Modifier       = require('famous/core/Modifier');
  var StateModifier  = require('famous/modifiers/StateModifier');
  var MouseSync      = require('famous/inputs/MouseSync');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing         = require('famous/transitions/Easing');
  var Quaternion     = require('famous/math/Quaternion');

  var CubeView = require('views/CubeView');

  function RotatingCube() {
    View.apply(this, arguments);


    var backgroundSurface = new Surface({
      size: [undefined, undefined]
    });

    var sync = new MouseSync();

    backgroundSurface.pipe(sync);

    this.add(backgroundSurface);

    var delta = [0, 0]; //movement of the mouse
    var position = [0,1,2]; //total number of turns in each direction
    var state = [0,0,1]; //current front face
    var nVec = [0,1,0]; //current top face
    var index = [0,0,0]; //90 degree turn unit
    var left = 0;
    var down = 0;

    var transitionable = new Transitionable(0);
    var quaternion = new Quaternion(1, 0, 0, 0);
    var quaternionUpdate = new Quaternion(1, 0, 1, 0);

    sync.on('update', function (data) {
      delta[0] += data.delta[0];
      delta[1] += data.delta[1];
    });

    sync.on('end', function () {
      console.log()
      if (Math.abs(delta[0]) > Math.abs(delta[1])){
        left = delta[0] > 0 ? -1 : 1;
        // index[0] = delta[0] > 0 ? 1 : -1; 
      } else{
        down = delta[1] > 0 ? 1 : -1;
        // index[1] = delta[0] > 0 ? 1 : -1; 
      }

      transitionable.set(1, {
          duration: 1000, curve: Easing.outBack
      });      
      console.log('left: ', left);
      console.log('down: ', down);
      console.log('state: ', state);
      console.log('nVec: ', nVec);
      console.log('delta', delta);
    });

    // var rotationModifier = new Modifier({
    //   transform: function () {
    //     var rotateAng = transitionable.get();
    //     if (rotateAng  > .99999){
          
    //       transitionable.reset(0);
    //       transitionable.halt();
    //       console.log('position: ', position);
    //     }

    //     var trans = quaternion.getTransform();
 
    //     return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
    //   }
    // });

    var rotationModifier = new Modifier({
        origin: [0.5, 0.5]
    });

    // Bind the box's rotation to the quaternion
    rotationModifier.transformFrom(function() {
      quaternionUpdate = quaternionUpdate.multiply(quaternion);

      var trans = quaternionUpdate.getTransform();

      var trans = quaternionUpdate.slerp(quaternion.getTransform(), 0.5);


      // return trans;
      return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
    });
    var mainCube = new CubeView();
    var node = this.add(rotationModifier).add(mainCube);

    var smallCube = new CubeView({ size: 25 });

    var smallCubeModifier = new Modifier({
      transform: Transform.translate(75, 75, 75)
    });

    smallCube.pipe(sync);
    
    node.add(smallCubeModifier).add(smallCube);

    // var mainCubeModifier = new Modifier({
    //   origin: [0.5, 0.5],
    //   align: [0.5, 0.5]
    // });

    // var mainCube = new CubeView();

    // node.add(mainCubeModifier).add(mainCube);

  }

  RotatingCube.prototype = Object.create(View.prototype);
  RotatingCube.prototype.constructor = RotatingCube;

  RotatingCube.DEFAULT_OPTIONS = {};

  module.exports = RotatingCube;
});
