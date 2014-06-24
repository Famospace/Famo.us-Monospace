/* This view is to create small cubes that gets destroyed by the destroyer cube*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var CubeView      = require('views/CubeView');
  var Levels        = require('../../content/levels');


  function LevelSelection() {
    View.apply(this, arguments);

    var rootModifier = new Modifier({
      size: [undefined, undefined]
    });

    this.node = this.add(rootModifier);

    // console.log(Levels);

    _checkBoxSize.call(this);
    _createMenu.call(this);
    _createHeaderBlock.call(this);
    _createLevelBlock.call(this);
    _setListeners.call(this);
  }

  LevelSelection.DEFAULT_OPTIONS = {
    width: 3,
    height: 4,
    boxSize: 75,
    headerFront: '<h1>',
    headerBack: '</h1>',
    boxFront: '</h2>',
    boxBack: '</h2>',
  };

  LevelSelection.prototype = Object.create(View.prototype);
  LevelSelection.prototype.constructor = LevelSelection;

  function _checkBoxSize(){
    var tempWidth = this.options.boxSize * (this.options.width+3);
    var tempHeight = this.options.boxSize * (this.options.height+5);

    // console.log('temp: ', tempWidth, tempHeight);
    // console.log('actual:', window.innerWidth, window.innerHeight);

    if (window.innerWidth < tempWidth || window.innerHeight < tempHeight){
      this.options.boxSize = 50;
      this.options.headerFront = '<h2>';
      this.options.headerBack = '</h2>';
    } else {
      this.options.boxSize = 75;
      this.options.headerFront = '<h1>';
      this.options.headerBack = '</h1>';
    }
  }

  function _createHeaderBlock(){

    var modifier = new Modifier({
      size: [window.innerWidth, this.options.boxSize],
      origin: [0.5, 0.1],
      align: [ 0, 0]
    });

    var surface = new Surface({
      content: 'Level Selection',
      // content: this.options.headerFront+'Level Selection'+this.options.headerBack,
      properties: {
        textAlign: 'center',
        verticalAlign: 'middle',
        fontFamily: 'HelveticaNeue-Light',
        fontSize: '1.8rem'
      }
    });

    this.node.add(modifier).add(surface);
  }

  function _createLevelBlock(){
    var index = 1;
    for (var j=0; j<this.options.height; j++){
      for (var i=0; i < this.options.width; i++){
        var modifier = new Modifier({
          size: [this.options.boxSize, this.options.boxSize],
          origin: [(1/(this.options.width+1))*(i+1), (1/(this.options.height+2))*(j+2)],
          align: [ 0.5, 0.5]
        });

        var surface = new Surface({
          content: index,
          properties: {
            border: '3px solid black',
            borderRadius: '7px',
            textAlign: 'center',
            lineHeight: '40px',
            fontFamily: 'HelveticaNeue-Light'
          }
        });

        surface.on('click', function(index){
          this.emit('startGameToL', Levels.levels[index-1]);
        }.bind(surface, index));

        surface.pipe(this);

        this.node.add(modifier).add(surface);
        index ++;
      }
    }
  }

  function _setListeners(){
    this._eventInput.on('startGameToL', function(data){
      this._eventOutput.emit('startGame', data);
    }.bind(this));
  }

  function _createMenu () {
    var menuButton = new Surface({
      content: 'Back',
      properties: {
        textAlign: 'center',
        border: '1px solid black',
        borderRadius: '5px',
        fontSize: '.8rem',
        fontFamily: 'HelveticaNeue-Light',
        zIndex: 4,
        lineHeight: '37px'
      }
    });

    var menuButtonMod = new Modifier({
      size: [50, 50],
      align: [1, 0],
      origin: [1, 0]
    });

    this.node.add(menuButtonMod).add(menuButton);

    menuButton.on('click', function () {
      this._eventOutput.emit('mainMenu');
    }.bind(this));
  }

  module.exports = LevelSelection;
});
