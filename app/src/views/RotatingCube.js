define(function(require, exports, module) {
  var View           = require('famous/core/View');
  var Surface        = require('famous/core/Surface');
  var Transform      = require('famous/core/Transform');
  var Modifier       = require('famous/core/Modifier');
  var StateModifier  = require('famous/modifiers/StateModifier');
  var MouseSync      = require('famous/inputs/MouseSync');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');

  var CubeView = require('views/CubeView');

  function RotatingCube() {
    View.apply(this, arguments);


    var backgroundSurface = new Surface({
      size: [undefined, undefined]
    });

    var sync = new MouseSync();

    backgroundSurface.pipe(sync);

    this.add(backgroundSurface);

    var delta = [0, 0];
    var position = [0,0,0];
    var state = [0,0,1];
    var index = [0,0,0];
    var right = 0;
    var up = 0;

    var transitionable = new Transitionable(0);

    sync.on('update', function (data) {
      delta[0] += data.delta[0];
      delta[1] -= data.delta[1];
    });

    sync.on('end', function () {
      console.log()
      if (Math.abs(delta[0]) > Math.abs(delta[1])){
        right = delta[0] > 0 ? 1 : -1;
        // index[0] = delta[0] > 0 ? 1 : -1; 
      } else{
        up = delta[0] > 0 ? 1 : -1;
        // index[1] = delta[0] > 0 ? 1 : -1; 
      }
      transitionable.set(1, {
          duration: 1000, curve: Easing.outBack
      });      
      console.log('index', index);
      console.log('delta', delta);
    });


    var rotateModifier = new Modifier({
      transform: function () {
        var rotateAng = transitionable.get();
        if (rotateAng  > .99999){
          position[0] += index[0];
          position[1] += index[1];
          position[2] += index[2];
          console.log('complete transition', position);
          index = [0,0,0];
          delta = [0,0];
          transitionable.reset(0);
          transitionable.halt();
        }

        if(state === [0,0,1]){
          index = [right, up, 0];
          if (up !== 0){
            state = [-up,0,0];
          }else{
            state = [0,-right,0];
          }
        }else if(state = [0,0,-1]){
          index = [-right, up, 0];
          if (up !== 0){
            state = [-up,0,0];
          }else{
            state = [0,right,0];
          }
        }else if(state = [0,1,0]){
          index = [0, right, up];
          if (up !== 0){
            state = [0,0,-up];
          }else{
            state = [0,-right,0];
          }
        }else if(state = [0,-1,0]){
          index = [0, right, -up];
          if (up !== 0){
            state = [0,0,up];
          }else{
            state = [0,-right,0];
          }
        }else if(state = [1,0,0]){
          index = [up, 0, -right];
          if (up !== 0){
            state = [-up,0,0];
          }else{
            state = [0,0,right];
          }
        }else{
          index = [up, 0, right];
          if (up !== 0){
            state = [-up,0,0];
          }else{
            state = [0,0,-right];
          }
        }

        var trans = Transform.rotate((position[1]+index[1]*rotateAng)*Math.PI/2, 
          (position[0]+index[0]*rotateAng)*Math.PI/2, 
          (position[2]+index[2]*rotateAng)*Math.PI/2);
        return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
      }
    });

    var node = this.add(rotateModifier);

    var smallCube = new CubeView({ size: 25 });

    var smallCubeModifier = new Modifier({
      transform: Transform.translate(75, 75, 75)
    });

    smallCube.pipe(sync);
    
    node.add(smallCubeModifier).add(smallCube);

    var mainCubeModifier = new Modifier();

    var mainCube = new CubeView();

    node.add(mainCubeModifier).add(mainCube);

  }

  RotatingCube.prototype = Object.create(View.prototype);
  RotatingCube.prototype.constructor = RotatingCube;

  RotatingCube.DEFAULT_OPTIONS = {};

  module.exports = RotatingCube;
});
