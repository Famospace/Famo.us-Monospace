// This view does the 3D cube rotation and the mouse/touch event for the 3D rotation
define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing         = require('famous/transitions/Easing');
    var Timer          = require('famous/utilities/Timer');
    var GameBoard      = require('views/GameBoard');

    var MouseSync      = require('famous/inputs/MouseSync');
    var TouchSync      = require('famous/inputs/TouchSync');

    function RotatingLogic() {
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
        _createGameBoard.call(this);
        _setListeners.call(this);
    }

    RotatingLogic.prototype = Object.create(View.prototype);
    RotatingLogic.prototype.constructor = RotatingLogic;

    RotatingLogic.prototype.setDestroyerPosition = function(pos){
      this.gameBoard.setDestroyerPosition(pos);
    };

    // when starting a new game rest variable to starting position and call game board
    // startNewGame method
    RotatingLogic.prototype.startNewGame = function(starter){
      this.state = [0,0,1];
      this.nVec = [0,-1,0];
      this.rVec = [1,0,0];
      this.index = [0,0,0];
      this.gameBoard.startNewGame(starter);

      // transition to starting position
      this.transitionable.set(1, {
          duration: 0
      });      
    };

    RotatingLogic.DEFAULT_OPTIONS = {
      mainCubeSize: 400,
      destroyer: undefined,
      smallCube: undefined
    };

    // create game board view
    function _createGameBoard() {
      this.gameBoard = new GameBoard({
        mainCubeSize: this.options.mainCubeSize,
        destroyer: this.options.destroyer,
        smallCube: this.options.smallCube
      });
      this.node.add(this.gameBoard);
    }

    // create background surface to listen for mouse/touch events
    function _createBackground () {
      this.backgroundSurface = new Surface({
          size: [undefined, undefined]
      });

      this.add(this.backgroundSurface);
    }
    
    //create the rotational modifier for the 3D cube transitions
    function _createRotateModifier () {
      var rotateModifier = new Modifier({
        // transition logic
        transform: function () {
          // set rotating angle to 0-1 transitionable
          var rotateAng = this.transitionable.get();
          // When rotation angle almost gets to 1, lock it to 1
          if (rotateAng  > 0.99999){
            // set the the current variables to the new state
            this.rotation = mapStateTransition(this.state, this.nVec);
            this.index = [0,0,0];
            this.position = [0,0];
            this.left = 0;
            this.down = 0;
            this.transitionable.reset(0);
            this.transitionable.halt(); // halt transitionable
            // update new normal vector and right vector to send to game logic
            var updateObj = {
              nVec: this.nVec,
              rVec: this.rVec
            };
            this._eventOutput.emit('coordinateUpdate', updateObj);
          }
          // the actual transition in the transfrom function
          var rotTrans = Transform.rotate((this.index[0]*rotateAng)*Math.PI/2,
            (this.index[1]*rotateAng)*Math.PI/2,
            (this.index[2]*rotateAng)*Math.PI/2);
          return Transform.multiply(this.rotation, rotTrans);
        }.bind(this)
      });

      this.node = this.add(rotateModifier);
    }
    // This is the function determines the movement of the mouse/touch to determine
    // rotation of the cube
    function _setBackgroundListeners () {
      // set mouse sync and touch sync
      this.parentCubeMouseSync = new MouseSync();
      this.parentCubeTouchSync = new TouchSync();
      // pipe sync to surface
      this.backgroundSurface.pipe(this.parentCubeMouseSync);
      this.backgroundSurface.pipe(this.parentCubeTouchSync);

      // on update, add delta position
      this.parentCubeMouseSync.on('update', function (data) {
        this.position[0] += data.delta[0];
        this.position[1] += data.delta[1];
      }.bind(this));
      
      // on end determine the delta in x and y direction to determine the cube movement
      this.parentCubeMouseSync.on('end', function () {
        // one direction must exceed 5 px to avoid single clicks
        if (Math.abs(this.position[0]) < 5 && Math.abs(this.position[1]) < 5) {
          this.position = [0, 0];
          return false;
        }
        // determine left/right/up/down
        if (Math.abs(this.position[0]) > Math.abs(this.position[1])){
          this.left = this.position[0] > 0 ? -1 : 1;
        } else{
          this.down = this.position[1] > 0 ? 1 : -1;
        }
        
        // calculate state transition
        updateStateTransition.call(this,this.left,this.down);

        // set transitionable and restart transition to new state
        this.transitionable.set(1, {
            duration: 500, curve: Easing.outBack
        });      

      }.bind(this));

      // on update, add delta position
      this.parentCubeTouchSync.on('update', function (data) {
        this.position[0] += data.delta[0];
        this.position[1] += data.delta[1];
      }.bind(this));
      
      // on end determine the delta in x and y direction to determine the cube movement
      this.parentCubeTouchSync.on('end', function () {
        if (Math.abs(this.position[0]) < 5 && Math.abs(this.position[1]) < 5) {
          this.position = [0, 0];
          return false;
        }
        if (Math.abs(this.position[0]) > Math.abs(this.position[1])){
          this.left = this.position[0] > 0 ? -1 : 1;
        } else{
          this.down = this.position[1] > 0 ? 1 : -1;
        }

        updateStateTransition.call(this,this.left,this.down);

        this.transitionable.set(1, {
          duration: 500, curve: Easing.outBack
        });      
      }.bind(this));
    }

    // set listeners for this view
    function _setListeners() {

      this.gameBoard.pipe(this._eventInput);
      this.gameBoard.subscribe(this._eventOutput);

      this._eventInput.on('movingCubeToRL', function(data){
        this._eventOutput.emit('movingCubeToGL', data);
      }.bind(this));
      // 2D to 3D transition to pipe and unpipe background listeners
      this._eventInput.on('is2d', function(data){
        if (data){
          this.backgroundSurface.unpipe(this.parentCubeMouseSync);
          this.backgroundSurface.setProperties({pointerEvents: 'none'});
        } else{
          this.backgroundSurface.pipe(this.parentCubeMouseSync);
          this.backgroundSurface.setProperties({pointerEvents: 'auto'});
        }
        this._eventOutput.emit('is2d', data);
      }.bind(this));
    }
    
    // this function takes the current state and orientation and determines the next state
    // give rotation of right or left or up or down.
    function updateStateTransition(left, down){
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
    // this function maps the rotation from starting state to current state 
    // with maximum of axial rotation
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

    module.exports = RotatingLogic;
});
