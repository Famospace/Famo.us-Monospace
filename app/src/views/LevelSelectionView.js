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
    this.levelSurfaces = [];

    // console.log(Levels);

    _loadLocalStorage.call(this);
    _checkBoxSize.call(this);
    _createMenu.call(this);
    _createHeaderBlock.call(this);
    _createLevelBlock.call(this);
    _setListeners.call(this);
    _setLevelCompletedListener.call(this);
  }

  LevelSelection.DEFAULT_OPTIONS = {
    width: 3,
    height: 4,
    boxSize: 75,
    headerFontSize: '3rem',
    lineHeight: '65px',
    boxFontSize: '1.8rem'

  };

  LevelSelection.prototype = Object.create(View.prototype);
  LevelSelection.prototype.constructor = LevelSelection;

  function _loadLocalStorage () {

    // checks to see if localstorage is enabled
    if (!window.localStorage || window.localStorage === null) {
      this.localStorage = false;
      return;
    }

    // check for previously saved game
    if (window.localStorage.getItem('famospace') === null) {
      // set up one if first time playing
      window.localStorage.setItem('famospace',[0,0,0,0,0,0,0,0,0,0,0,0]);
    }

    this.localStorage = window.localStorage.getItem('famospace').split(',');
  }

  function _checkBoxSize(){
    var tempWidth = this.options.boxSize * (this.options.width+3);
    var tempHeight = this.options.boxSize * (this.options.height+5);

    console.log('temp: ', tempWidth, tempHeight);
    console.log('actual:', window.innerWidth, window.innerHeight);

    if (window.innerWidth < tempWidth || window.innerHeight < tempHeight){
      this.options.boxSize = 50;
      this.options.headerFontSize = '1.8rem';
      this.options.lineHeight = '40px';
      this.options.boxFontSize = '1rem';
    } 
  }

  function _setLevelCompletedListener () {
    this._eventInput.on('levelCompleted', function (levelIndex) {
      // update localStorage
      this.localStorage[levelIndex] = 1;
      window.localStorage.setItem('famospace',this.localStorage);

      // change surface color of completed level
      this.levelSurfaces[levelIndex].setProperties({color: 'black'});
    }.bind(this));
  }

  function _createHeaderBlock(){

    var modifier = new Modifier({
      size: [window.innerWidth, this.options.boxSize],
      origin: [0.5, 0.1],
      align: [ 0, 0]
    });

    var surface = new Surface({
      content: 'Level Selection',
      properties: {
        textAlign: 'center',
        verticalAlign: 'middle',
        fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
        fontSize: this.options.headerFontSize
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
            border: '3px solid #738F99',
            borderRadius: '7px',
            textAlign: 'center',
            lineHeight: this.options.lineHeight,
            fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
            fontSize: this.options.boxFontSize,
            backgroundColor: '#34A4CC',
            color: 'white',
            cursor: 'pointer'
          }
        });

        this.levelSurfaces.push(surface);

        if (this.localStorage && this.localStorage[index-1] === '1') {
          surface.setProperties({color: 'black'});
        }

        surface.on('click', function(index){
          var levelPackage = {level: Levels.levels[index-1], levelNum: index-1};
          this.emit('startGameToL', levelPackage);
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
        fontSize: '.8rem',
        fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
        zIndex: 4,
        lineHeight: '45px',
        cursor: 'pointer'

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
