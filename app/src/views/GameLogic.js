/* This the heart of the game, controlls all the cube movement and game play logic*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Modifier      = require('famous/core/Modifier');
  var Timer         = require('famous/utilities/Timer');
  var RotatingLogic = require('views/RotatingLogic');
  var Buzz          = require('buzz');
  var Levels        = require('../../content/levels');

  function GameLogic() {
    View.apply(this, arguments);

    // Create Root Modifier
    var rootModifier = new Modifier();
    this.node = this.add(rootModifier);

    // Create sound objects
    this.mySound = new Buzz.sound("content/sounds/die.wav");
    this.completeSound = new Buzz.sound("content/sounds/level-up.wav");


    this.twoDDataStructure = {};
    this.is2d = false;
    this.board = Levels.demoLevel.smallCube || _forceSlice(this.options.smallCube);
    this.destroyerCubeLocation = Levels.demoLevel.destroyer || this.options.destroyer;

    _createRotatingLogic.call(this);
    _createDevPerspectiveToggle.call(this);
    _destroyerMovement.call(this);
    _setListeners.call(this);
  }

    GameLogic.prototype = Object.create(View.prototype);
    GameLogic.prototype.constructor = GameLogic;
    
    // Set Game logic default options with default game board
    GameLogic.DEFAULT_OPTIONS = {
      mainCubeSize: 400,
      destroyer: [ 3,  0,  3 ],
      smallCube: [
        [0, 0, 0 ],
        [1, 0, 0 ],
        [2, 0, 0 ],
        [3, 0, 0 ],
 
        [0, 1, 0 ],
        [1, 1, 0 ],
        [2, 1, 0 ],
        [3, 1, 0 ],
       
        [0, 2, 0 ],
        [1, 2, 0 ],
        [2, 2, 0 ],
        [3, 2, 0 ],
       
        [0, 3, 0 ],
        [1, 3, 0 ],
        [2, 3, 0 ],
        [3, 3, 0 ]
      ]
    };

    // Create a button to toggle between 2D-3D (this function may be removed)
    function _createDevPerspectiveToggle () {
      var devSurface = new Surface({
        size: [50, 50],
        content: 'Toggle 2D/3D',
        properties: {
          textAlign: 'center',
          color: 'red',
          backgroundColor: 'black'
        }
      });

      var modifier = new Modifier ({
        origin: [0.1, 0.1]
      });
      
      // On click, trigger the is2d event to main.js and rotating logic view
      devSurface.on('click', function () {
        if (this.is2d === false && _ableToConvertTo2d.call(this) === true) {
          this._eventOutput.trigger('is2d', true);
          this.is2d = !this.is2d;
        } else if (this.is2d === false && _ableToConvertTo2d.call(this) === false) {
          _deny3D.call(this);
        } else {
          this._eventOutput.trigger('is2d', false);
          this.is2d = !this.is2d;
          _convertTo3d.call(this);
        }
      }.bind(this));

      this.node.add(modifier).add(devSurface);
    }

    // A visual effect created for an illegal 3D to 2D transition
    function _deny3D () {
      this._eventOutput.trigger('is2d', true);
      Timer.setTimeout(function () {
        this._eventOutput.trigger('is2d', false);
      }.bind(this), 600);
    }

    // Create the rotating logic which controls the orientation of the game board
    function _createRotatingLogic () {
      this.rotatingLogic = new RotatingLogic({
        mainCubeSize: this.options.mainCubeSize,
        destroyer: Levels.demoLevel.destroyer,
        smallCube: Levels.demoLevel.smallCube
      });
      this.node.add(this.rotatingLogic);
    }
    
    // set even listeners to main.js and rotating logic view
    function _setListeners (){
      this.rotatingLogic.pipe(this._eventInput);
      this.rotatingLogic.subscribe(this._eventOutput);
    }

    // Determine the destroyers movement when reciving a moving cube event
    function _destroyerMovement(){
      this._eventInput.on('movingCubeToGL', function(data){
        // make a copy of the current cube location
        var requestedPos = this.destroyerCubeLocation.slice();

        var update = false;
        for (var i =0; i<this.destroyerCubeLocation.length; i++){
          var tempUpdate = this.destroyerCubeLocation[i]
            + this.rotatingLogic.rVec[i]*data[0]
            + this.rotatingLogic.nVec[i]*data[1];

          if (tempUpdate >= 0 && tempUpdate <= 3){
            requestedPos[i] = tempUpdate;
            update = true;
          }
        }
        if(update){

        }
        var newPos = _DCcanMove.call(this, requestedPos);           

        if (newPos){
          this.destroyerCubeLocation = newPos;
          _removeSmallCube.call(this, newPos);
          this.mySound.load().play();
          this.rotatingLogic.setDestroyerPosition(newPos);
        }
      }.bind(this));
    }

    function _DCcanMove (newPos) {
      var currentAxis = _findCurrentXY(this.rotatingLogic.nVec, this.rotatingLogic.rVec, this.rotatingLogic.state);

      var newPos2D = [newPos[currentAxis.x], newPos[currentAxis.y]].join('');

      console.log('2d pos:', newPos2D);
      console.log('2d structure:', this.twoDDataStructure);
      console.log('2d array:', this.twoDDataStructure[newPos2D]);


      if (this.twoDDataStructure[newPos2D]) {
        if(this.twoDDataStructure[newPos2D].length > 0){
          console.log('in pop');
          var output = this.twoDDataStructure[newPos2D].pop();
          console.log('2d structure after:', this.twoDDataStructure);
          return output;
        }
      }
      return false;
    }

    function _removeSmallCube(pos){
        // console.log('board', this);
        for(var i =0; i < this.board.length; i++){
            if (this.board[i][0] === pos[0]
                && this.board[i][1] === pos[1]
                && this.board[i][2] === pos[2]){
                console.log('array', this.board);
                console.log('remove', pos);
                this.board.splice(i,1);
                console.log('array', this.board.length);
                if(this.board.length < 1){
                  console.log('complete');
                  this.completeSound.load().play();
                }
                return;
            }
        }
        console.log('no cube removed', pos);
    }

    function _ableToConvertTo2d () {
      _create2dDataStructure.call(this);
      // find current zAxis and zPosNeg
      var currentAxis = _findCurrentXY.call(this, this.rotatingLogic.nVec, this.rotatingLogic.rVec, this.rotatingLogic.state);
      // find current destroyerCubeLocation
      var dcLocation = this.destroyerCubeLocation;
      var key =  '';
      key += dcLocation[currentAxis.x];
      key += dcLocation[currentAxis.y];

      // find current twoDDataStructure
      var currentSmallCubePos = this.twoDDataStructure;
      var match = currentSmallCubePos[key];

      return ( match &&
          (
            ( currentAxis.zPosNeg > 0 && (dcLocation[currentAxis.z] < match[0][currentAxis.z])) ||
            ( currentAxis.zPosNeg < 0 && (dcLocation[currentAxis.z] > match[0][currentAxis.z]))
          )
       ) ? false : true;
    }

    function _findCurrentXY (nVec, rVec, state) {
      // identifies which index is current X, Y, and Z

      var result = {}, i, j, k;

      for (i=0;i<nVec.length;i++) {
        if (nVec[i] !== 0) {
          result.y = i;
          result.yPosNeg = 1 * nVec[i];
          break;
        }
      }

      for (j=0;j<rVec.length;j++) {
        if (rVec[j] !== 0) {
          result.x = j;
          result.xPosNeg = 1 * rVec[j];
          break;
        }
      }

      for (k=0;k<state.length;k++) {
        if (state[k] !== 0) {
          result.z = k;
          result.zPosNeg = 1 * state[k];
          break;
        }
      }

      return result;
    }

    function _create2dDataStructure () {

      var currentAxis = _findCurrentXY(this.rotatingLogic.nVec, this.rotatingLogic.rVec, this.rotatingLogic.state);
      var key = '';
      var smallCube;
      
     var currentSmallCubePos = _forceSlice(this.board);

      // creates twoDDataStructure
      // format: { XY coordinates: [[first visible box at XY], [second visible box at XY], [etc.]] }
      for (var j=0;j<currentSmallCubePos.length;j++) {
        smallCube = currentSmallCubePos[j];

        key = '';
        key += smallCube[currentAxis.x];
        key += smallCube[currentAxis.y];

        if (!this.twoDDataStructure[key]) {
          this.twoDDataStructure[key] = [smallCube];
        } else {
          this.twoDDataStructure[key].push(smallCube);
          if (currentAxis.zPosNeg > 0) {
            this.twoDDataStructure[key].sort(function (a, b) { return b[currentAxis.z] - a[currentAxis.z]; });
          } else {
            this.twoDDataStructure[key].sort(function (a, b) { return a[currentAxis.z] - b[currentAxis.z]; });
          }
        }

      }

      console.info('%c2D Data Structure: ', 'color: blue', this.twoDDataStructure);
    }

    function _convertTo3d () {
      this.twoDDataStructure = {};
    }

    function _forceSlice (array) {
      var newArray = [];
      for (var i=0;i<array.length;i++) {
        newArray.push(array[i].slice());
      }
      return newArray;
    }

    module.exports = GameLogic;
});
