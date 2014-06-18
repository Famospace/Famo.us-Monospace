define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Modifier       = require('famous/core/Modifier');
    var Transform     = require('famous/core/Transform');

    var CubeView      = require('views/CubeView');
    var DestroyerCube = require('views/DestroyerCube');
    var SmallCube     = require('views/SmallCube');


    function GameBoard() {
        View.apply(this, arguments);
        this.is2D = true;
        
        var rootModifier = new Modifier();

        this.node = this.add(rootModifier);

        _createParentCube.call(this);
        _createDestroyerCube.call(this);
        _createSmallCubes.call(this);
        _setListeners.call(this);
    }

    GameBoard.prototype = Object.create(View.prototype);
    GameBoard.prototype.constructor = GameBoard;

    GameBoard.DEFAULT_OPTIONS = {
      destroyer:[150, 150, 150],
      destroyerColor: 'blue',
      smallCube:[
        [-150, -150, -150],
        [-50, -150, -150],
        [50, -150, -150],
        [150, -150, -150]
      ],
      smallCubeColor: 'red'
    };

    function _createDestroyerCube () {
        this.destroyerCube = new DestroyerCube({
            position: this.options.destroyer,
            color: this.options.destroyerColor
        });
        this.node.add(this.destroyerCube);
    }

    function _createParentCube () {
        this.cube = new CubeView({
            size:200
        });

        for (var j=0;j<this.cube.surfaces.length;j++) {
            this.cube.surfaces[j].setProperties({pointerEvents: 'none'});
        }
        this.node.add(this.cube);
    }

    function _createSmallCubes() {
        this.smallCubes = [];
        for (var i=0; i<this.options.smallCube.length; i++){
            var smallCube = new SmallCube({
                startPosition: this.options.smallCube[i],
                cubeColor: this.options.smallCubeColor
            });
            this.smallCubes.push(smallCube);
            this.node.add(smallCube);
        }
    }

    function _setListeners() {
        if (this.is2D){
            this.destroyerCube.pipe(this._eventInput);

        }else{
            this.destroyerCube.unpipe(this._eventInput);
        }

        this._eventInput.on('movingCube', function(data){
            this._eventOutput.emit('movingCube', data);
        }.bind(this));
    }
    module.exports = GameBoard;

});

