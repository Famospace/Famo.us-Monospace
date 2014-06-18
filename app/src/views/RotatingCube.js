define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var MouseSync      = require('famous/inputs/MouseSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing         = require('famous/transitions/Easing');

    var CubeView = require('views/CubeView');
    var DestroyerCube = require('views/DestroyerCube');

    function RotatingCube() {
        View.apply(this, arguments);

        this.position = [0, 0]; //mouse movement
        this.state = [0,0,1]; //current front face
        this.nVec = [0,-1,0]; //current top face
        this.rVec = [1,0,0]; //current right face
        this.index = [0,0,0]; //90 degree turn unit
        this.left = 0; //rotate left
        this.down = 0; //rotate down
        this.rotation = Transform.rotate(0,0,0); //initial transfrom matrix
        
        this.transitionable = new Transitionable(0);

        _createRotateModifier.call(this);
        _createBackground.call(this);
        _setBackgroundListeners.call(this);
        _createParentCube.call(this);
        _createDestroyerCube.call(this);
        _setListeners.call(this);
    }

    RotatingCube.prototype = Object.create(View.prototype);
    RotatingCube.prototype.constructor = RotatingCube;

    RotatingCube.DEFAULT_OPTIONS = {};

    function _createDestroyerCube () {
        this.destroyerCube = new DestroyerCube();
        this.node.add(this.destroyerCube);
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
            var rotateAng = this.transitionable.get();
            if (rotateAng  > 0.99999){
              this.rotation = mapStateTransition(this.state, this.nVec);
              this.index = [0,0,0];
              this.position = [0,0];
              this.left = 0;
              this.down = 0;
              this.transitionable.reset(0);
              this.transitionable.halt();

              var updateObj = {
                nVec: this.nVec,
                rVec: this.rVec
              };
              this._eventOutput.emit('coordinateUpdate', updateObj);
            }

            var rotTrans = Transform.rotate((this.index[0]*rotateAng)*Math.PI/2,
              (this.index[1]*rotateAng)*Math.PI/2,
              (this.index[2]*rotateAng)*Math.PI/2);
            return Transform.multiply(this.rotation, rotTrans);
          }.bind(this)
        });

        this.node = this.add(rotateModifier);
    }

    function _setBackgroundListeners () {
        var ParentCubeSync = new MouseSync();

        this.backgroundSurface.pipe(ParentCubeSync);

        ParentCubeSync.on('update', function (data) {
            this.position[0] += data.delta[0];
            this.position[1] += data.delta[1];
        }.bind(this));

        ParentCubeSync.on('end', function () {
            if (Math.abs(this.position[0]) > Math.abs(this.position[1])){
                this.left = this.position[0] > 0 ? -1 : 1;
            } else{
                this.down = this.position[1] > 0 ? 1 : -1;
            }

            updateStateTransition.call(this,this.left,this.down);

            this.transitionable.set(1, {
                duration: 500, curve: Easing.outBack
            });      
            console.log('left: ', this.left);
            console.log('down: ', this.down);
            console.log('state: ', this.state);
            console.log('nVec: ', this.nVec);
            console.log('rVec', this.rVec);
        }.bind(this));
    }

    function _setListeners() {
        this.destroyerCube.subscribe(this._eventOutput);
    }

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
            this.rVec = [0,0,-left*tempState[2]];
          }
        }else{ //this.nVec = [1,0,0] or [-1,0,0] 
          if (down !== 0){ 
            this.index = [0, -down*this.nVec[0], 0];
            this.state = [down*this.nVec[0],0,0];
            this.nVec = [0,0,-down*tempState[2]];
          }else{
            this.index = [left*this.nVec[0], 0, 0];
            this.state = [0, left*this.nVec[0],0];
            this.rVec = [0,0,-left*tempState[2]];
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
            this.rVec = [0,0,-left*tempState[2]];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            this.index = [0, down*this.nVec[0], 0];
            this.state = [down*this.nVec[0],0,0];
            this.nVec = [0,0,-down*tempState[2]];
          }else{
            this.index = [left*this.nVec[0], 0, 0];
            this.state = [0, -left*this.nVec[0],0];
            this.rVec = [0,0,-left*tempState[2]];
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
            this.rVec = [0,-left*tempState[1],0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            this.index = [0, 0, down*this.nVec[0]];
            this.state = [down*this.nVec[0],0,0];
            this.nVec = [0,-down*tempState[1],0];
          }else{
            this.index = [left*this.nVec[0], 0, 0];
            this.state = [0,0,-left*this.nVec[0]];
            this.rVec = [0,-left*tempState[1],0];
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
            this.rVec = [0,-left*tempState[1],0];
          }
        }else{
          if (down !== 0){ //[1,0,0] or [-1,0,0]
            this.index = [0, 0, -down*this.nVec[0]];
            this.state = [down*this.nVec[0],0,0];
            this.nVec = [0,-down*tempState[1],0];
          }else{
            this.index = [left*this.nVec[0], 0, 0];
            this.state = [0,0,left*this.nVec[0]];
            this.rVec = [0,-left*tempState[1],0];
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
            this.rVec = [-left*tempState[0],0,0];
          }
        }else{
          if (down !== 0){ //[0,1,0] or [0,-1,0]
            this.index = [0, 0, -down*this.nVec[1]];
            this.state = [0,down*this.nVec[1],0];
            this.nVec = [-down*tempState[0],0,0];
          }else{
            this.index = [0, left*this.nVec[1], 0];
            this.state = [0,0,left*this.nVec[1]];
            this.rVec = [-left*tempState[0],0,0];
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
            this.rVec = [-left*tempState[0],0,0];
          }
        }else{
          if (down !== 0){ //[0,1,0] or [0,-1,0]
            this.index = [0, 0, down*this.nVec[1]];
            this.state = [0,down*this.nVec[1],0];
            this.nVec = [-down*tempState[0],0,0];
          }else{
            this.index = [0, left*this.nVec[1], 0];
            this.state = [0,0, -left*this.nVec[1]];
            this.rVec = [-left*tempState[0],0,0];
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
