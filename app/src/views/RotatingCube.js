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

    var delta = [0, 0]; //movement of the mouse
    this.state = [0,0,1]; //current front face
    this.nVec = [0,-1,0]; //current top face
    this.index = [0,0,0]; //90 degree turn unit
    var left = 0;
    var down = 0;

    var transitionable = new Transitionable(0);

    sync.on('update', function (data) {
      delta[0] += data.delta[0];
      delta[1] += data.delta[1];
    });

    sync.on('end', function () {
      if (Math.abs(delta[0]) > Math.abs(delta[1])){
        left = delta[0] > 0 ? -1 : 1;
        // index[0] = delta[0] > 0 ? 1 : -1; 
      } else{
        down = delta[1] > 0 ? 1 : -1;
        // index[1] = delta[0] > 0 ? 1 : -1; 
      }

      updateStateTransition.call(this,left,down);

      transitionable.set(1, {
          duration: 1000, curve: Easing.outBack
      });      
      console.log('left: ', left);
      console.log('down: ', down);
      console.log('state: ', this.state);
      console.log('nVec: ', this.nVec);
      console.log('delta', delta);
    }.bind(this));

    var rotation = Transform.rotate(0,0,0);

    var rotateModifier = new Modifier({
      transform: function () {
        var rotateAng = transitionable.get();
        if (rotateAng  > 0.99999){
          rotation = mapStateTransition(this.state, this.nVec);
          console.log(rotation);
          this.index = [0,0,0];
          delta = [0,0];
          left = 0;
          down = 0;
          transitionable.reset(0);
          transitionable.halt();
        }

        var rotTrans = Transform.rotate((this.index[0]*rotateAng)*Math.PI/2,
          (this.index[1]*rotateAng)*Math.PI/2,
          (this.index[2]*rotateAng)*Math.PI/2);
        return Transform.multiply(rotation, rotTrans);
      }.bind(this)
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

  function updateStateTransition(left, down){
    console.log('test', this.nVec);
    if(this.state[2] === 1){ //[0,0,1]
      var tempState = this.state;
      if (this.nVec[1] !== 0){ //[0,1,0] or [0,-1,0]
        if (down !== 0){
          this.index = [down*this.nVec[1], 0, 0];
          this.state = [0,down*this.nVec[1],0];
          this.nVec = [0,0,-down*tempState[2]];
        }else{
          this.index = [0, left*this.nVec[1], 0];
          this.state = [-left*this.nVec[1],0,0];
        }
      }else{ //this.nVec = [1,0,0] or [-1,0,0] 
        if (down !== 0){ 
          this.index = [0, -down*this.nVec[0], 0];
          this.state = [down*this.nVec[0],0,0];
          this.nVec = [0,0,-down*tempState[2]];
        }else{
          this.index = [left*this.nVec[0], 0, 0];
          // this.index = [left*this.nVec[0], 0, 0];
          this.state = [0, left*this.nVec[0],0];
        }
      }
    }else if(this.state[2] === -1){ //[0,0,-1]
      var tempState = this.state;
      if (this.nVec[1] !== 0){ //[0,1,0] or [0,-1,0]
        if (down !== 0){
          this.index = [-down*this.nVec[1], 0, 0];
          this.state = [0,down*this.nVec[1],0];
          this.nVec = [0,0,-down*tempState[2]];
        }else{
          this.index = [0, left*this.nVec[1], 0];
          this.state = [left*this.nVec[1],0,0];
        }
      }else{
        if (down !== 0){ //[1,0,0] or [-1,0,0]
          this.index = [0, down*this.nVec[0], 0];
          this.state = [down*this.nVec[0],0,0];
          this.nVec = [0,0,-down*tempState[2]];
        }else{
          this.index = [left*this.nVec[0], 0, 0];
          this.state = [0, -left*this.nVec[0],0];
        }
      }
    }else if(this.state[1] === 1){//[0,1,0]
      var tempState = this.state;
      if (this.nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
        if (down !== 0){
          this.index = [-down*this.nVec[2], 0, 0];
          this.state = [0,0,down*this.nVec[2]];
          this.nVec = [0,-down*tempState[1],0];
        }else{
          this.index = [0, 0, left*this.nVec[2]];
          this.state = [left*this.nVec[2],0,0];
        }
      }else{
        if (down !== 0){ //[1,0,0] or [-1,0,0]
          this.index = [0, 0, down*this.nVec[0]];
          this.state = [down*this.nVec[0],0,0];
          this.nVec = [0,-down*tempState[1],0];
        }else{
          this.index = [left*this.nVec[0], 0, 0];
          this.state = [0,0,-left*this.nVec[0]];
        }
      }
    }else if(this.state[1] === -1){ //[0,-1,0]
      var tempState = this.state;
      if (this.nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
        if (down !== 0){
          this.index = [down*this.nVec[2], 0, 0];
          this.state = [0,0,down*this.nVec[2]];
          this.nVec = [0,-down*tempState[1],0];
        }else{
          this.index = [0, 0, left*this.nVec[2]];
          this.state = [-left*this.nVec[2],0,0];
        }
      }else{
        if (down !== 0){ //[1,0,0] or [-1,0,0]
          this.index = [0, 0, -down*this.nVec[0]];
          this.state = [down*this.nVec[0],0,0];
          this.nVec = [0,-down*tempState[1],0];
        }else{
          this.index = [left*this.nVec[0], 0, 0];
          this.state = [0,0,left*this.nVec[0]];
        }
      }
    }else if(this.state[0] === 1){ //[1,0,0]
      var tempState = this.state;
      if (this.nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
        if (down !== 0){
          this.index = [0, down*this.nVec[2], 0];
          this.state = [0,0,down*this.nVec[2]];
          this.nVec = [-down*tempState[0],0,0];
        }else{
          this.index = [0, 0, left*this.nVec[2]];
          this.state = [0,-left*this.nVec[2],0];
        }
      }else{
        if (down !== 0){ //[0,1,0] or [0,-1,0]
          this.index = [0, 0, -down*this.nVec[1]];
          this.state = [0,down*this.nVec[1],0];
          this.nVec = [-down*tempState[0],0,0];
        }else{
          this.index = [0, left*this.nVec[1], 0];
          this.state = [0,0,left*this.nVec[1]];
        }
      }
    }else{ //[-1,0,0]
      var tempState = this.state;
      if (this.nVec[2] !== 0){ //[0,0,1] or [0,0,-1]
        if (down !== 0){
          this.index = [0, -down*this.nVec[2], 0];
          this.state = [0,0,down*this.nVec[2]];
          this.nVec = [-down*tempState[0],0,0];
        }else{
          this.index = [0, 0, left*this.nVec[2]];
          this.state = [0,left*this.nVec[2],0];
        }
      }else{
        if (down !== 0){ //[0,1,0] or [0,-1,0]
          this.index = [0, 0, down*this.nVec[1]];
          this.state = [0,down*this.nVec[1],0];
          this.nVec = [-down*tempState[0],0,0];
        }else{
          this.index = [0, left*this.nVec[1], 0];
          this.state = [0,0, -left*this.nVec[1]];
        }
      }
    }
  }

  function mapStateTransition(state, nVec){
    var rotationMap = {
      '1,0,0':  {'rotate': [0,-1,0],
                 '0,-1,0': [0,0,0],
                 '0,1,0':  [2,0,0],
                 '0,0,1':  [1,0,0],
                 '0,0,-1': [-1,0,0]},
      '-1,0,0': {'rotate': [0,1,0],
                 '0,-1,0': [0,0,0],
                 '0,1,0':  [2,0,0],
                 '0,0,1':  [1,0,0],
                 '0,0,-1': [-1,0,0]},
      '0,-1,0': {'rotate': [-1,0,0],
                 '0,0,-1': [0,0,0],
                 '0,0,1':  [0,2,0],
                 '1,0,0':  [0,1,0],
                 '-1,0,0': [0,-1,0]},
      '0,1,0':  {'rotate': [1,0,0],
                 '0,0,1': [0,0,0],
                 '0,0,-1':  [0,2,0],
                 '1,0,0':  [0,-1,0],
                 '-1,0,0': [0,1,0]},
      '0,0,-1': {'rotate': [0,2,0],
                 '0,-1,0': [0,0,0],
                 '0,1,0':  [0,0,2],
                 '1,0,0':  [0,0,-1],
                 '-1,0,0': [0,0,1]},
      '0,0,1':  {'rotate': [0,0,0],
                 '0,-1,0': [0,0,0],
                 '0,1,0':  [0,0,2],
                 '1,0,0':  [0,0,-1],
                 '-1,0,0': [0,0,1]}
    };


    var first = rotationMap[state]['rotate'];
    var second =  rotationMap[state][nVec];

    var trans = Transform.multiply(Transform.rotate(first[0]*Math.PI/2,first[1]*Math.PI/2,first[2]*Math.PI/2),
      Transform.rotate(second[0]*Math.PI/2,second[1]*Math.PI/2,second[2]*Math.PI/2));

    return trans;
  }

  module.exports = RotatingCube;
});
