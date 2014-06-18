define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier      = require('famous/core/Modifier');
    var RotatingLogic = require('views/RotatingLogic');

    function GameLogic() {
        View.apply(this, arguments);

        var rootModifier = new Modifier();
        this.node = this.add(rootModifier);

        // this.normalCubes = [];
        this.is2d = false;
        this.board = this.options.board;
        this.destroyerCubeLocation = this.options.destroyerCube;
        this.currentSmallCubePos = this.options.smallCube;

        _createRotatingLogic.call(this);
        _createDevPerspectiveToggle.call(this);
    }

    GameLogic.prototype = Object.create(View.prototype);
    GameLogic.prototype.constructor = GameLogic;
    

    GameLogic.DEFAULT_OPTIONS = {
        mainCubeSize: 400,
        destroyer: [ 3,  3,  3 ],
        smallCube: [
             // normal cubes
             [-3, -3, -3 ],
             [ -1, -3, -3 ],
             [  1, -3, -3 ],
             [ 3, -3, -3 ], 

             [-3,  -1, -3 ],
             [ -1,  -1, -3 ],
             [  1,  -1, -3 ],
             [ 3,  -1, -3 ], 
            
             [-3,   1, -3 ],
             [ -1,   1, -3 ],
             [  1,   1, -3 ],
             [ 3,   1, -3 ],
            
             [-3,  3, -3 ],
             [ -1,  3, -3 ],
             [  1,  3, -3 ],
             [ 3,  3, -3 ]

        ]
    };

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

        devSurface.on('click', function () {
            if (this.is2d === false
                // && _ableToConvertTo2d() === true
                ) {
                this._eventOutput.trigger('is2d', true);
                this.is2d = !this.is2d;
            } else {
                this._eventOutput.trigger('is2d', false);
                this.is2d = !this.is2d;
            }
        }.bind(this));

        this.node.add(modifier).add(devSurface);
    }

    function _createRotatingLogic () {

        this.rotatingLogic = new RotatingLogic({
            mainCubeSize: this.options.mainCubeSize,
            destroyer: this.options.destroyer,
            smallCube: this.options.smallCube
        });
        this.node.add(this.rotatingLogic);
    }







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
      var nVec = gameLogic.parentCube.nVec;
      var state = gameLogic.parentCube.state;
      var cubeSize = gameLogic.cubeSize;
      var rVec = null; // something

      // record all positions of cubes
      currentSmallCubePos = gameLogic.board;

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
      for (var j=0;j<gameLogic.board.length;j++) {
        gameLogic.board[j][stateIndex] = 3 * statePosNeg;
        // if (overlappingHash[])
      }

      // create arrays for overlapping boxes !!!





      console.log(
        'state: ',stateIndex * statePosNeg,
        '\nFirst Cube\'s state index:', gameLogic.board[0]
        );
          // toggle something?
          // record allowed moves
    }

    function _convertTo3d () {
      // returns boxes to original positions
    }











/*

    function _createDestroyerCube () {
        var dcLocation = [
            this.destroyerCubeLocation[0] * this.cubeSize, 
            this.destroyerCubeLocation[1] * this.cubeSize, 
            this.destroyerCubeLocation[2] * this.cubeSize
        ];

        this.destroyerCube = new DestroyerCube({position: dcLocation});
        this.parentCube.node.add(this.destroyerCube);
    }

    function _createNormalCubes () {
        for (var i=0;i<this.board.length;i++) {

            var cube = new CubeView({size: 50});

            var cubeMod = new Modifier({
                transform: Transform.translate(
                    this.board[i][0] * this.cubeSize, 
                    this.board[i][1] * this.cubeSize, 
                    this.board[i][2] * this.cubeSize
                )
            });

            for (var j=0;j<cube.surfaces.length;j++) {
                cube.surfaces[j].setProperties({ pointerEvents: 'none' });
            }

            this.normalCubes.push(cube);

            this.parentCube.node
                .add(cubeMod)
                .add(cube);
        }
    }

*/

    module.exports = GameLogic;
});
