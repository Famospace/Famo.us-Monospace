/* This view is for displaying level selection; user will be able to choose levels in this view*/
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Modifier      = require('famous/core/Modifier');
  var Transform      = require('famous/core/Transform');
  var Levels        = require('../../content/levels');


  function LevelSelection() {
    View.apply(this, arguments);

    var rootModifier = new Modifier({
      size: [undefined, undefined]
    });

    this.node = this.add(rootModifier); //root modifier
    this.levelSurfaces = []; //save reference to each level surface

    _loadLocalStorage.call(this);
    _checkBoxSize.call(this);
    _createMenu.call(this);
    _createHeaderBlock.call(this);
    _createLevelBlock.call(this);
    _setListeners.call(this);
    _setLevelCompletedListener.call(this);
    _createGithubLink.call(this);
  }

  LevelSelection.DEFAULT_OPTIONS = {
    row: 3,
    column: 4,
    boxSize: 75,
    headerFontSize: '3rem',
    lineHeight: '65px',
    boxFontSize: '1.8rem'

  };

  LevelSelection.prototype = Object.create(View.prototype);
  LevelSelection.prototype.constructor = LevelSelection;


  function _createGithubLink () {
    var banner = new Surface({
      size: [window.innerWidth * 0.05, window.innerHeight * 0.05],
        content: '<a href="https://github.com/Famospace/Famo.us-Monospace">' +
                       '<img src="https://camo.githubusercontent.com/c6286ade715e9bea433b4705870de482a654f78a/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f77686974655f6666666666662e706e67"' +
                         'alt="Fork me on GitHub"' +
                         'imgdata-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_white_ffffff.png">' +
                       '</a>',
      properties: {
        zIndex: 5
      }
    });

    var bannerMod = new Modifier({
      align: [0, 0],
      origin: [0, 0],
      transform: function () {
        if (window.innerWidth < 800) {
          return Transform.scale(0.7, 0.7, 0.7);
        }
      }.bind(this)
    });

    this.add(bannerMod).add(banner);
  }

  // load local storage to save completed level
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
    // retrieve data from local storage
    this.localStorage = window.localStorage.getItem('famospace').split(',');
  }
  
  // determine the size of the window to determine the square size and font size
  function _checkBoxSize(){
    var tempWidth = this.options.boxSize * (this.options.row+3);
    var tempHeight = this.options.boxSize * (this.options.column+5);

    // console.log('temp: ', tempWidth, tempHeight);
    // console.log('actual:', window.innerWidth, window.innerHeight);

    if (window.innerWidth < tempWidth || window.innerHeight < tempHeight){
      this.options.boxSize = 50;
      this.options.headerFontSize = '1.8rem';
      this.options.lineHeight = '40px';
      this.options.boxFontSize = '1rem';
    } 
  }

  // Set listeners when levels are completed and update local storage with complete level
  function _setLevelCompletedListener () {
    this._eventInput.on('levelCompleted', function (levelIndex) {
      // update localStorage
      this.localStorage[levelIndex] = 1;
      window.localStorage.setItem('famospace',this.localStorage);

      // change surface color of completed level
      this.levelSurfaces[levelIndex].setProperties({color: 'black'});
    }.bind(this));
  }
  
  // create the header for level selection
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
  // create a square for each box with listeners to load the proper level
  function _createLevelBlock(){
    var index = 1;
    // cycle through each row and column
    for (var j=0; j<this.options.column; j++){
      for (var i=0; i < this.options.row; i++){
        // placement of the square is determined by 
        var modifier = new Modifier({
          size: [this.options.boxSize, this.options.boxSize],
          origin: [(1/(this.options.row+1))*(i+1), (1/(this.options.column+2))*(j+2)],
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
        // if local storage for the level is set to 1, use black font
        if (this.localStorage && this.localStorage[index-1] === '1') surface.setProperties({color: 'black'});
        
        // on set listners on surface and bind with index, which represent the level
        surface.on('click', function(index){
          var levelPackage = {level: Levels.levels[index-1], levelNum: index-1};
          this.emit('startGameToL', levelPackage);
        }.bind(surface, index));
        
        // pipe surface to the view
        surface.pipe(this);

        this.node.add(modifier).add(surface);
        index ++;
      }
    }
  }

  // listen for start game from level surface and emit event to game logic to start game
  function _setListeners(){
    this._eventInput.on('startGameToL', function(data){
      this._eventOutput.emit('startGame', data);
    }.bind(this));
  }

  // create back button for level selection view
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
