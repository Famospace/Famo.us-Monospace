/* This the heart of the game, controlls all the cube movement and game play logic*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var Timer         = require('famous/utilities/Timer');
  var RotatingLogic = require('views/RotatingLogic');
  // var Buzz          = require('buzz');

  function GameLogic() {
    View.apply(this, arguments);

    // Create Root Modifier
    var rootModifier = new Modifier();
    this.node = this.add(rootModifier);

    this.terminate = false; // boolean to terminate sound if left demo view
    this.showMenu = false; // boolean to show or hide menu
    this.ready = true; // waiting for the menu transition is complete
    
    // Create sound objects
    if (!buzz) window.location.reload(true);
    this.mySound = new buzz.sound('content/sounds/smack.wav',{
      preload: true
    });
    this.completeSound = new buzz.sound('content/sounds/level-up.wav',{
      preload: true
    });
    this.transitionSound = new buzz.sound('content/sounds/swoosh.wav',{
      preload: true
    });
    
    this.twoDDataStructure = {}; // data structure to track of cubes in 2D mode
    this.is2d = false; // 2D 3D state
    this.board = undefined; // reference to game board
    this.destroyerCubeLocation = undefined; //reference to destroyer cube location

    _determineCubeSize.call(this);
    _createRotatingLogic.call(this);
    _createPerspectiveButton.call(this);
    _destroyerMovement.call(this);
    _setListeners.call(this);
    _createMenu.call(this);
  }

    GameLogic.prototype = Object.create(View.prototype);
    GameLogic.prototype.constructor = GameLogic;
    
    // Set Game logic default options with default game board
    GameLogic.DEFAULT_OPTIONS = {
      mainCubeSize: 400,
      destroyer: [-1000,  -1000,  -1000],
      smallCube: [
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
 
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
       
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
       
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000],
        [-1000, -1000, -1000]
      ]
    };

    // Create menu for game logic view to restart, move to menu view, move to level view
    function _createMenu () {
      var menuButton = new Surface({
        content: 'Menu',
        properties: {
          textAlign: 'center',
          fontSize: '.8rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 4,
          lineHeight: '45px',
          cursor: 'pointer'
        }
      });

      // Create menu modifier to align top right corner
      var menuButtonMod = new Modifier({
        size: [50, 50],
        align: [1, 0],
        origin: [1, 0]
      });

      // Create restart button surface
      var restartButton = new Surface({
        content:'Restart',
        properties: {
          textAlign: 'center',
          fontSize: '.8rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 4,
          lineHeight: '45px',
          cursor: 'pointer'
        }
      });

      var restartButtonMod = new Modifier({
        size: [50, 50],
        align: [1, 0],
        origin: [1, 0],
        transform: Transform.translate(-50, -50, 0)
      });

      // Create button surface to move back to level selection view
      var levelSelectButton = new Surface({
        content:'Levels',
        properties: {
          textAlign: 'center',
          fontSize: '.8rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 4,
          lineHeight: '45px',
          cursor: 'pointer'
        }
      });

      var levelSelectButtonMod = new Modifier({
        size: [50, 50],
        align: [1, 0],
        origin: [1, 0],
        transform: Transform.translate(-100, -50, 0)
      });

      // Create button surface to move back to menu view
      var exitButton = new Surface({
        content:'Exit',
        properties: {
          textAlign: 'center',
          fontSize: '.8rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 4,
          lineHeight: '45px',
          cursor: 'pointer'
        }
      });

      var exitButtonMod = new Modifier({
        size: [50, 50],
        align: [1, 0],
        origin: [1, 0],
        transform: Transform.translate(-140, -50, 0)

      });

      // adding all the buttons to the root modifier
      this.node.add(menuButtonMod).add(menuButton);
      this.node.add(levelSelectButtonMod).add(levelSelectButton);
      this.node.add(restartButtonMod).add(restartButton);
      this.node.add(exitButtonMod).add(exitButton);

      // create event listeners on each button
      menuButton.on('click', function () {
        if (!this.ready) return;
        if (this.showMenu) {
          this.ready = false;
          _hideMenu.call(this);
          this.showMenu = !this.showMenu;
        } else {
          this.ready = false;
          _showMenu.call(this);
          this.showMenu = !this.showMenu;
        }
      }.bind(this));

      restartButton.on('click', function () {
        if (!this.showMenu) return false;
        // console.log('clicked restart');
        _restartGame.call(this);
        this.showMenu = false;
        Timer.setTimeout(_hideMenu, 500);
      }.bind(this));

      exitButton.on('click', function () {
        if (!this.showMenu) return false;
        this._eventOutput.emit('mainMenu');
        this.showMenu = false;
        Timer.setTimeout(_hideMenu, 500);
      }.bind(this));

      levelSelectButton.on('click', function () {
        if (!this.showMenu) return false;
        this._eventOutput.emit('levels');
        this.showMenu = false;
        Timer.setTimeout(_hideMenu, 500);
      }.bind(this));

      // hide the menu and transform each button off the page
      function _hideMenu () {
        restartButtonMod.setTransform(Transform.translate(-50, -50, 0), {duration: 500, curve: 'easeInOut'});
        levelSelectButtonMod.setTransform(Transform.translate(-100, -50, 0), {duration: 400, curve: 'easeInOut'});
        exitButtonMod.setTransform(Transform.translate(-140, -50, 0), {duration: 300, curve: 'easeInOut'});
        Timer.setTimeout(function () {this.ready = true;}.bind(this), 500);
      }
      // hide the menu and transform each button on to the page
      function _showMenu () {
        restartButtonMod.setTransform(Transform.translate(-50, 0, 0), {duration: 300, curve: 'easeInOut'});
        levelSelectButtonMod.setTransform(Transform.translate(-100, 0, 0), {duration: 400, curve: 'easeInOut'});
        exitButtonMod.setTransform(Transform.translate(-140, 0, 0), {duration: 500, curve: 'easeInOut'});
        Timer.setTimeout(function () {this.ready = true;}.bind(this), 500);
      }
    }

    function _saveToLocalStorage (levelIndex) {
      // checks to see if localstorage is enabled
      if (!window.localStorage || window.localStorage === null) return;

      var localStorage = window.localStorage.getItem('famospace').split(',');

      //send event to LevelSelectionView to change level color and update localStorage
      if (localStorage[levelIndex] === '0') this._eventOutput.emit('levelCompleted', levelIndex);
    }

    // determine the game board (main cube) size base on window width;
    // greater than 800: 400x400x400 cube
    // less than 800: 200x200x200 cube
    function _determineCubeSize(){
      // console.log('windowwidth:', window.innerWidth);
      if (window.innerWidth < 600 || window.innerHeight < 600){
        this.options.mainCubeSize = 200;
      }
    }
    // method to start a new game base on input data of cube location (starter package); 
    // reset all variables
    function _startNewGame (starter){
      this.levelIndex = starter.levelNum;
      this.starter = starter;
      this.board = _forceSlice(starter.level.smallCube);
      this.destroyerCubeLocation = starter.level.destroyer;
      this.rotatingLogic.startNewGame(starter.level);
      this._eventOutput.trigger('is2d', false);
      this.perspectiveButton.setContent('2D');
      this.is2d = false;
      this.twoDDataStructure = {};
    }
    
    // restart current level by startNewGame with the current starter package
    function _restartGame(){
      // console.log('restart game');
      _startNewGame.call(this,this.starter);
    }
    
    // set startNewGame to prototype for external access
    GameLogic.prototype.startNewGame = _startNewGame;

    // set soundOff variabale for demo view
    GameLogic.prototype.setSoundOff = function(bool){
      this.terminate = bool;
    };

    // Create the button to change 2D/3D perspective 
    function _createPerspectiveButton () {
      // Create button surface
      this.perspectiveButton = new Surface({
        size: [undefined, undefined],
        content: '<div>2D</div>',
        properties: {
          fontSize: '3rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          textAlign: 'center',
          lineHeight: '65px',
          verticalAlign: 'middle',
          color: 'white',
          backgroundColor: '#34A4CC',
          borderRadius: '20px',
          border: '3px solid #738F99',
          cursor: 'pointer',
          zIndex: 5
        }
      });

      // create a modifier that will dynamically relocate the button base on the 
      // size of the window with respect to cubesize
      this.perspectiveButtonMod = new Modifier ({
        size: [75, 75],
        align: [0.5, 0.5],
        origin: function () {
          if (this.options.mainCubeSize < 400){
            if (window.innerWidth < window.innerHeight) {
              return [0.5, 0.97];
            }else{
              return [0.97, 0.5];
            }
          }else{
            if (window.innerHeight > window.innerWidth) {
              if (window.innerHeight < 1000){
                return [0.5, 0.97];
              }else{
                return [0.5, 0.83];
              }
            }else{
              if (window.innerWidth < 1100){
                return [0.95, 0.5];
              }else{
                return [0.83, 0.5];
              }
            }
          }
        }.bind(this)
      });
      
      // Create event listeners for 2D/3D transition
      this.perspectiveButton.on('click', function () {
        if (this.is2d === false && _ableToConvertTo2d.call(this) === true) {
          this.transitionSound.play();
          this._eventOutput.trigger('is2d', true);
          this.perspectiveButton.setContent('3D');
          this.is2d = !this.is2d;
        } else if (this.is2d === false && _ableToConvertTo2d.call(this) === false) {
          _deny3D.call(this);
        } else {
          this.transitionSound.play();
          this._eventOutput.trigger('is2d', false);
          this.perspectiveButton.setContent('2D');
          this.is2d = !this.is2d;
          _convertTo3d.call(this);
        }
      }.bind(this));

      this.node.add(this.perspectiveButtonMod).add(this.perspectiveButton);
    }

    // Create the rotating logic which controls the orientation of the game board
    function _createRotatingLogic () {
      this.rotatingLogic = new RotatingLogic({
        mainCubeSize: this.options.mainCubeSize,
        destroyer: this.options.destroyer,
        smallCube: this.options.smallCube
      });
      this.node.add(this.rotatingLogic);
    }
    
    // set even listeners to main.js and rotating logic view
    function _setListeners (){
      this.rotatingLogic.pipe(this._eventInput);
      this.rotatingLogic.subscribe(this._eventOutput);
      this._eventInput.on('startGame', function(data){
        _startNewGame.call(this,data);
      }.bind(this));
    }

    // A visual effect created for an illegal 3D to 2D transition
    function _deny3D () {
      this._eventOutput.trigger('is2d', true);
      Timer.setTimeout(function () {
        this._eventOutput.trigger('is2d', false);
      }.bind(this), 600);
    }

    // Determine the destroyers movement when reciving a moving cube event
    function _destroyerMovement(){
      this._eventInput.on('movingCubeToGL', function(data){
        // make a copy of the current cube location
        var requestedPos = this.destroyerCubeLocation.slice();
        //an update flag, if movement update is required
        var update = false;
        for (var i =0; i<this.destroyerCubeLocation.length; i++){
          var tempUpdate = this.destroyerCubeLocation[i]
            + this.rotatingLogic.rVec[i]*data[0]
            + this.rotatingLogic.nVec[i]*data[1];

          if (tempUpdate >= 0 && tempUpdate <= 3){ //determine
            requestedPos[i] = tempUpdate;
            update = true;
          }
        }
        if(update){ // if movement update is required check adjacent space
          var newPos = _DCcanMove.call(this, requestedPos);           

          if (newPos){ 
            //if a new positions is returned, move the destroyer cube and remove small cube
            this.destroyerCubeLocation = newPos;
            _removeSmallCube.call(this, newPos);
            this.rotatingLogic.setDestroyerPosition(newPos);
          }
        }
      }.bind(this));
    }

    // function to determine if destroyer cube can move to the appointed location by determining
    // whethere is is a small cube in that location
    function _DCcanMove (newPos) {
      // Determine th current axial position in 2D view
      var currentAxis = _findCurrentXY(this.rotatingLogic.nVec, this.rotatingLogic.rVec, this.rotatingLogic.state);

      // create key for 2D data structure object
      var newPos2D = [newPos[currentAxis.x], newPos[currentAxis.y]].join('');

      // determine if key returns an array, if yes, pop the last element and return
      if (this.twoDDataStructure[newPos2D]) {
        if(this.twoDDataStructure[newPos2D].length > 0){
          var output = this.twoDDataStructure[newPos2D].pop();
          return output;
        }
      }
      return false;
    }
    // remove small cube from given position
    function _removeSmallCube(pos){
      for(var i =0; i < this.board.length; i++){
        // if position matches the position at i in the game board
        if (this.board[i][0] === pos[0]
          && this.board[i][1] === pos[1]
          && this.board[i][2] === pos[2]){

          // remove the piece from array
          this.board.splice(i,1);
          //play sound if allowed
          if (!this.terminate) this.mySound.play();
          if(this.board.length < 1){
            // if board is less than 1 (last piece); play sound move back to levels view
            if (!this.terminate){
              _saveToLocalStorage.call(this, this.levelIndex);
              this.completeSound.play();
            }
            Timer.setTimeout(function(){
              this._eventOutput.emit('levels');
            }.bind(this), 500);
          }
          return;
        }
      }
      // console.log('no cube removed', pos);
    }
    
    // expose removeSmallCube function for external use (demo view)
    GameLogic.prototype.removeSmallCube = _removeSmallCube;

    // determine wheter converting to 2D is a legal move (when a small cube is above,
    // in terms of depth, of the destroyer cube in 3D mode, 2D mode is not allowed)
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

      // if match is not null and check the depth between destroyer and small cubes
      return ( match &&
        (
          ( currentAxis.zPosNeg > 0 && (dcLocation[currentAxis.z] < match[0][currentAxis.z])) ||
          ( currentAxis.zPosNeg < 0 && (dcLocation[currentAxis.z] > match[0][currentAxis.z]))
        )
      ) ? false : true;
    }
    
    // determine the current state of axial position
    function _findCurrentXY (nVec, rVec, state) {
      // identifies which index is current X, Y, and Z
      var result = {}, i, j, k;
      
      // normal vector is y axis in 2D
      for (i=0;i<nVec.length;i++) {
        if (nVec[i] !== 0) {
          result.y = i;
          result.yPosNeg = 1 * nVec[i];
          break;
        }
      }
      // right vector is the z axis in 2D
      for (j=0;j<rVec.length;j++) {
        if (rVec[j] !== 0) {
          result.x = j;
          result.xPosNeg = 1 * rVec[j];
          break;
        }
      }
      // state vector doesnt show in 2D
      for (k=0;k<state.length;k++) {
        if (state[k] !== 0) {
          result.z = k;
          result.zPosNeg = 1 * state[k];
          break;
        }
      }
      return result;
    }
    
    // compress 3D coordinate system into a 2D data structure with 2D coordinate as key
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
          if (currentAxis.zPosNeg < 0) {
            this.twoDDataStructure[key].sort(function (a, b) { return b[currentAxis.z] - a[currentAxis.z]; });
          } else {
            this.twoDDataStructure[key].sort(function (a, b) { return a[currentAxis.z] - b[currentAxis.z]; });
          }
        }
      }
    }

    // intialize 2D data structure when converting back to 3D
    function _convertTo3d () {
      this.twoDDataStructure = {};
    }

    // Slice array in array
    function _forceSlice (array) {
      var newArray = [];
      for (var i=0;i<array.length;i++) {
        newArray.push(array[i].slice());
      }
      return newArray;
    }

    module.exports = GameLogic;
});
