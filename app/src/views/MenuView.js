define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier     = require('famous/core/Modifier');
  var Timer         = require('famous/utilities/Timer');
  var RenderNode     = require('famous/core/RenderNode');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Lightbox      = require('famous/views/Lightbox');
  var Easing        = require('famous/transitions/Easing');

  var AboutView     = require('views/AboutView');
  var MainMenuView  = require('views/MainMenuView');
  var demoView      = require('views/demoView');
  var GameLogic     = require('views/GameLogic');
  var LevelSelection = require('views/LevelSelectionView');

  function MenuView() {
    View.apply(this, arguments);

    this.views = {};
    this.playingDemo = true;
    this.ready = true;


    _createIntro.call(this);    
    _createGameboard.call(this);
    _createAbout.call(this);
    _createMainMenu.call(this);
    _createLevelSelection.call(this);
    _createLightbox.call(this);
    _setLightboxListeners.call(this);
    _createLocalStoragePipe.call(this);
  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  MenuView.DEFAULT_OPTIONS = {
    lightboxOpts: {
      inOrigin: [0, 0],
      outOrigin: [0, 0],
      showOrigin: [0, 0],
      inTransform: Transform.translate(500, 0, 0),
      outTransform: Transform.translate(-500, 0, 0),
      inTransition: { duration: 650, curve: 'easeOut' },
      outTransition: { duration: 650, curve: 'easeOut' }
    }
  };

  function _createAbout () {
    var about = new AboutView();
    this.views.about = about;
  }
  
  function _createMainMenu () {
    var mainMenu = new MainMenuView();
    this.views.mainMenu = mainMenu;
  }

  function _createLightbox() {
    this.lightbox = new Lightbox(this.options.lightboxOpts);
    this.add(this.lightbox);
    this.lightbox.show(this.views.demoView);
  }

  function _createLocalStoragePipe () {
    this.game.pipe(this.views.levelSelection);
  }

  function _setLightboxListeners() {
    this.views.mainMenu.pipe(this);
    this.views.about.pipe(this);
    this.views.demoView.pipe(this);
    this.game.pipe(this);
    this.views.levelSelection.pipe(this);
    this.views.levelSelection.pipe(this.game);

    // manage perspective listeners
    this._eventInput.on('is2dDemo', function (data) {
      if (this.playingDemo) {
        this._eventOutput.emit('is2d', data);
      }
    }.bind(this));

    this._eventInput.on('is2d', function (data) {
      this._eventOutput.emit('is2d', data);
    }.bind(this));

    this._eventInput.on('demoToMainMenu', function () {
      if (this.playingDemo) {
        if (this.views.demoView.gameLogic){
          this.views.demoView.gameLogic.setSoundOff(true);
        }
        this.lightbox.show(this.views.mainMenu);
        this.playingDemo = false;
      }
    }.bind(this));


    // menu listeners
    this._eventInput.on('startGame', function () {
      if (this.ready) {
        this.lightbox.show(this.views.game);
        this.ready = false;
      }
      Timer.setTimeout(function () {this.ready = true;}.bind(this), 650);
    }.bind(this));

    this._eventInput.on('about', function () {
      if (this.ready) {
        this.lightbox.show(this.views.about);
        this.ready = false;
      }
      Timer.setTimeout(function () {this.ready = true;}.bind(this), 650);
    }.bind(this));

    this._eventInput.on('levels', function () {
      if (this.ready) {
        this.lightbox.show(this.views.levelSelection);
        this.ready = false;
      }
      Timer.setTimeout(function () {this.ready = true;}.bind(this), 650);
    }.bind(this));

    this._eventInput.on('mainMenu', function () {
      if (this.ready) {
        this.lightbox.show(this.views.mainMenu);
        this.ready = false;
      }
      Timer.setTimeout(function () {this.ready = true;}.bind(this), 650);
    }.bind(this));
  }

  function _createIntro () {
    var intro = new demoView();
    this.views.demoView = intro;
  }

  function _createLevelSelection () {
    var levelSelection = new LevelSelection();
    this.views.levelSelection = levelSelection;
  }

  function _createGameboard () {
    this.game = new GameLogic();

    var mod = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    var gameNode = new RenderNode();

    gameNode.add(mod).add(this.game);

    this.views.game = gameNode;
  }

  module.exports = MenuView;
});
