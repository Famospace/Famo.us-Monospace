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
    var nVec = [0,1,0];
    var index = [0,0,0];
    var right = 0;
    var down = 0;

    var transitionable = new Transitionable(0);

    sync.on('update', function (data) {
      delta[0] += data.delta[0];
      delta[1] += data.delta[1];
    });

    sync.on('end', function () {
      console.log()
      if (Math.abs(delta[0]) > Math.abs(delta[1])){
        right = delta[0] > 0 ? 1 : -1;
        // index[0] = delta[0] > 0 ? 1 : -1; 
      } else{
        down = delta[1] > 0 ? 1 : -1;
        // index[1] = delta[0] > 0 ? 1 : -1; 
      }

      if(state[2] === 1){ //[0,0,1]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[1] !== 0){ //[0,1,0] or [0,-1,0]
          if (down !== 0){
            state = [0,down*nVec[1],0];
            nVec = [0,0,-down*tempState[2]];
          }else{
            state = [-right*nVec[1],0,0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            state = [down*nVec[0],0,0];
            nVec = [0,0,-down*tempState[2]];
          }else{
            state = [0,right*nVec[0],0];
          }
        }
      }else if(state[2] === -1){ //[0,0,-1]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[1] !== 0){ //[0,1,0] or [0,-1,0]
          if (down !== 0){
            state = [0,down*nVec[1],0];
            nVec = [0,0,-down*tempState[2]];
          }else{
            state = [right*nVec[1],0,0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            state = [down*nVec[0],0,0];
            nVec = [0,0,-down*tempState[2]];
          }else{
            state = [0,-right*nVec[0],0];
          }
        }
      }else if(state[1] === 1){//[0,1,0]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
          if (down !== 0){
            state = [0,0,-down*nVec[2]];
            nVec = [0,down*tempState[1],0];
          }else{
            state = [right*nVec[2],0,0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            state = [down*nVec[0],0,0];
            nVec = [0,-down*tempState[1],0];
          }else{
            state = [0,0,-right*nVec[0]];
          }
        }
      }else if(state[1] === -1){ //[0,-1,0]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
          if (down !== 0){
            state = [0,0,down*nVec[2]];
            nVec = [0,-down*tempState[1],0];
          }else{
            state = [-right*nVec[2],0,0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            state = [down*nVec[0],0,0];
            nVec = [0,-down*tempState[1],0];
          }else{
            state = [0,0,right*nVec[0]];
          }
        }
      }else if(state[0] === 1){ //[1,0,0]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
          if (down !== 0){
            state = [0,0,down*nVec[2]];
            nVec = [-down*tempState[0],0,0];
          }else{
            state = [0,-right*nVec[2],0];
          }
        }else{
          if (down !== 0){ //[0,1,0] or [0,-1,0]
            state = [0,down*nVec[1],0];
            nVec = [-down*tempState[0],0,0];
          }else{
            state = [0,0,right*nVec[1]];
          }
        }
      }else{ //[-1,0,0]
        var tempState = state;
        index = [right, -down, 0];
        if (nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
          if (down !== 0){
            state = [0,0,down*nVec[2]];
            nVec = [-down*tempState[0],0,0];
          }else{
            state = [0,right*nVec[2],0];
          }
        }else{
          if (down !== 0){ //[0,1,0] or [0,-1,0]
            state = [0,down*nVec[1],0];
            nVec = [-down*tempState[0],0,0];
          }else{
            state = [0,0,-right*nVec[1]];
          }
        }
      }


      transitionable.set(1, {
          duration: 1000, curve: Easing.outBack
      });      
      console.log('right: ', right);
      console.log('down: ', down);
      console.log('state: ', state);
      console.log('nVec: ', nVec);
      console.log('delta', delta);
    });


    var rotateModifier = new Modifier({
      transform: function () {
        var rotateAng = transitionable.get();
        if (rotateAng  > .99999){
          position[0] += index[0];
          position[1] += index[1];
          position[2] += index[2];
          index = [0,0,0];
          delta = [0,0];
          right = 0;
          down = 0;
          transitionable.reset(0);
          transitionable.halt();
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
