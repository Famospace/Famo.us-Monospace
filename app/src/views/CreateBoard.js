define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier      = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RotatingCube  = require('views/RotatingCube');
    var DestroyerCube = require('views/DestroyerCube');
    var CubeView      = require('views/CubeView');

    function CreateBoard() {
        View.apply(this, arguments);

        this.normalCubes = [];
        this.board = this.options.board;
        this.destroyerCubeLocation = this.options.destroyerCube;

        _createParentCube.call(this);
        _createDestroyerCube.call(this);
        _createNormalCubes.call(this);
    }

    CreateBoard.prototype = Object.create(View.prototype);
    CreateBoard.prototype.constructor = CreateBoard;
    

    CreateBoard.DEFAULT_OPTIONS = {
        destroyerCube: [ 3,  3,  3 ],
        board: [
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

    function _createParentCube () {

        var parentCubeMod = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });

        this.parentCube = new RotatingCube();

        // defines cube size based on parent size
        this.cubeSize = this.parentCube.cube.surfaces[0].size[0] / 8;

        this.node = this.add(parentCubeMod);
        this.node.add(this.parentCube);
    }

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

    module.exports = CreateBoard;
});
