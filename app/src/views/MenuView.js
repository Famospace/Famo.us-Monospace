define(function(require, exports, module) {
  var View           = require('famous/core/View');
  var Transform      = require('famous/core/Transform');
  var Modifier       = require('famous/core/Modifier');
  var Timer          = require('famous/utilities/Timer');
  var RenderNode     = require('famous/core/RenderNode');
  var Lightbox       = require('famous/views/Lightbox'); 

  var AboutView      = require('views/AboutView');
  var MainMenuView   = require('views/MainMenuView');
  var DemoView       = require('views/DemoView');
  var GameLogic      = require('views/GameLogic');
  var LevelSelection = require('views/LevelSelectionView');

  function MenuView() {
    View.apply(this, arguments);

    this.views = {};
    // updating boolean to indicate demo is playing
    this.playingDemo = true; 
    // ensures that menu transitions don't overlap
    this.ready = true;

    _createViews.call(this);
    _createGameboard.call(this);
    _createLightbox.call(this);
    _setLightboxListeners.call(this);
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

  function _createViews () {
    this.views.about = new AboutView();
    this.views.mainMenu = new MainMenuView();
    this.views.demoView = new DemoView();
    this.views.levelSelection = new LevelSelection();
  }

  function _createLightbox() {
    this.lightbox = new Lightbox(this.options.lightboxOpts);
    this.add(this.lightbox);
    this.lightbox.show(this.views.demoView);
  }

  function _setLightboxListeners() {
    this.views.about.pipe(this);
    this.views.demoView.pipe(this);
    this.views.mainMenu.pipe(this);
    this.views.levelSelection.pipe(this);
    this.views.levelSelection.pipe(this.game);
    this.game.pipe(this.views.levelSelection);
    this.game.pipe(this);

    // manage perspective listeners
    this._eventInput.on('is2dDemo', function (data) {
      if (this.playingDemo) this._eventOutput.emit('is2d', data);
    }.bind(this));

    this._eventInput.on('is2d', function (data) {
      this._eventOutput.emit('is2d', data);
    }.bind(this));

    // ensures that demo's game board doesn't interfere with real game board
    this._eventInput.on('demoToMainMenu', function () {
      if (this.playingDemo) {
        if (this.views.demoView.gameLogic) this.views.demoView.gameLogic.setSoundOff(true);
        this.lightbox.show(this.views.mainMenu);
        this.playingDemo = false;
      }
    }.bind(this));

    // menu listeners
    this._eventInput.on('startGame', function () {
      // ensures menu events don't overlap
      if (this.ready) {
        this.ready = false;
        this.lightbox.show(this.views.game);
      }
      // resets this.ready after 650ms (time of menu transition)
      Timer.setTimeout(function () { this.ready = true; }.bind(this), 650);
    }.bind(this));

    this._eventInput.on('about', function () {
      if (this.ready) {
        this.ready = false;
        this.lightbox.show(this.views.about);
      }
      Timer.setTimeout(function () { this.ready = true; }.bind(this), 650);
    }.bind(this));

    this._eventInput.on('levels', function () {
      if (this.ready) {
        this.ready = false;
        this.lightbox.show(this.views.levelSelection);
      }
      Timer.setTimeout(function () { this.ready = true; }.bind(this), 650);
    }.bind(this));

    this._eventInput.on('mainMenu', function () {
      if (this.ready) {
        this.ready = false;
        this.lightbox.show(this.views.mainMenu);
      }
      Timer.setTimeout(function () { this.ready = true; }.bind(this), 650);
    }.bind(this));
  }

  function _createGameboard () {
    var gameNode = new RenderNode();
    this.game = new GameLogic();
    var mod = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    gameNode.add(mod).add(this.game);
    this.views.game = gameNode;
  }

  module.exports = MenuView;
});
