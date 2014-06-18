define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');  
  var Modifier        = require('famous/core/Modifier');
  var Surface        = require('famous/core/Surface');
  var Transitionable  = require('famous/transitions/Transitionable');
  var CreateBoard     = require('views/CreateBoard');

  var createBoard = new CreateBoard();
  var transitionable = new Transitionable(0);

  var modifier = new Modifier({
    origin: [0.5,0.5],
    align: [0.5,0.5]
  });

  var mainContext = Engine.createContext();

  mainContext.setPerspective(1000);


  var devSurface = new Surface({
    size: [50, 50],
    content: 'Toggle 2D/3D',
    properties: {
      textAlign: 'center',
      color: 'red',
      backgroundColor: 'black'
    }
  });
  mainContext.add(modifier).add(createBoard);

  // for testing purposes
  mainContext.add(devSurface);



  var currentNormalCubePos = [];
  var twoDMode = false;






  devSurface.on('click', function (data) {
    console.log(createBoard);


    if (!twoDMode) {
      mainContext.setPerspective(0);
      //disable pointer events on backgroundSurface
      createBoard.parentCube.backgroundSurface.setProperties({pointerEvents: 'none'});

    } else {
      mainContext.setPerspective(1000);
      //enable pointer events on backgroundSurface
      createBoard.parentCube.backgroundSurface.setProperties({pointerEvents: 'auto'});
    }


    twoDMode = !twoDMode;
    console.log(createBoard);
    console.log( 'Destroyer Cube: ', createBoard.destroyerCube.position );

    _convertTo2d.call(this);

  }.bind(this));

  function _ableToConvertTo2d () {
  // Are any cubes are in front of destroyerCube
    // yes: deny conversion to 2d
      // return false
    // no:
      return true;
  }




  function _convertTo2d () {
  // Is this allowed?
    if (!_ableToConvertTo2d) {
      // later, make this convert to 2d then bounce back to 3d
      return false;
    }

    // enable this later
    // twoDMode = true;

  // If allowed:
    var nVec = createBoard.parentCube.nVec;
    var state = createBoard.parentCube.state;
    var cubeSize = createBoard.cubeSize;
    var rVec = null; // something

    // record all positions of cubes
    currentNormalCubePos = createBoard.board;

    // identify current state
    var stateIndex = null;
    var statePosNeg = 1;
    for (var i=0;i<state.length;i++) {
      if (state[i] !== 0) {
        stateIndex = i;
        statePosNeg = statePosNeg * state[i];
        break;
      }
    }

    // find indeces that are NOT 'z'
    var firstOtherIndex;
    var secondOtherIndex;

    if (stateIndex === 0) {
      firstOtherIndex = 1;
      secondOtherIndex = 2;
    } else if (stateIndex === 1) {
      firstOtherIndex = 0;
      secondOtherIndex = 2;
    } else {
      firstOtherIndex = 0;
      secondOtherIndex = 1;
    }

    var overlappingHash = {};


    // translate all cubes to front face
    for (var j=0;j<createBoard.board.length;j++) {
      createBoard.board[j][stateIndex] = 3 * statePosNeg;
      // if (overlappingHash[])
    }

    // create arrays for overlapping boxes !!!





    console.log(
      'state: ',stateIndex * statePosNeg,
      '\nFirst Cube\'s state index:', createBoard.board[0]
      );
        // toggle something?
        // record allowed moves
  }

  function _convertTo3d () {
    // returns boxes to original positions
  }





});
