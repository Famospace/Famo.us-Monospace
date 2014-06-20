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

    GameBoard.prototype.setIs2D = function(bool){
        this.is2D = bool;
    };

    GameBoard.prototype.setDestroyerPosition = function(pos){
        var posPix = _convertToPixels.call(this,pos);
        this.destroyerCube.setPosition(posPix);
        for (var i = 0; i < this.smallCubes.length; i++){
            var cubePos = this.smallCubes[i].getPosition();
            if (cubePos[0] === posPix[0] && cubePos[1] === posPix[1] && cubePos[2] === posPix[2]){
                this.smallCubes[i].setPosition( _convertToPixels.call(this, [-10000,-10000,0]));
            }
        }
    };

    GameBoard.DEFAULT_OPTIONS = {
        mainCubeSize: 400,
        destroyer:[150, 150, 150],
        destroyerColor: 'blue',
        smallCubeColor: 'red'
    };

    function _createDestroyerCube () {
        this.destroyerCube = new DestroyerCube({
            startPosition: _convertToPixels.call(this,this.options.destroyer),
            color: this.options.destroyerColor,
            size: this.options.mainCubeSize/4
        });
        this.node.add(this.destroyerCube);
    }

    function _createParentCube () {
        this.cube = new CubeView({
            size: this.options.mainCubeSize
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
                startPosition: _convertToPixels.call(this,this.options.smallCube[i]),
                cubeColor: this.options.smallCubeColor,
                size: this.options.mainCubeSize/4
            });
            this.smallCubes.push(smallCube);
            this.node.add(smallCube);
        }
    }

    function _setListeners() {
        this._eventInput.on('is2d', function(data){
            console.log('GB is2d', data);
            if (data){
                this.destroyerCube.pipe(this._eventInput);
            }else{
                this.destroyerCube.unpipe(this._eventInput);
            }
        }.bind(this));

        this._eventInput.on('movingCubeToGB', function(data){
            console.log('GB movingCube', data);
            this._eventOutput.emit('movingCubeToRL', data);
        }.bind(this));
    }

    function _convertToPixels(array) {
        var output = [
            (array[0]-1.5)*this.options.mainCubeSize/4,
            (array[1]-1.5)*this.options.mainCubeSize/4,
            (array[2]-1.5)*this.options.mainCubeSize/4
        ];
        return output;
    };

    module.exports = GameBoard;

});

