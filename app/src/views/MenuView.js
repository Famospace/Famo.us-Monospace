define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier     = require('famous/core/Modifier');
  var RenderNode     = require('famous/core/RenderNode');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Lightbox      = require('famous/views/Lightbox');
  var Easing        = require('famous/transitions/Easing');

  var AboutView     = require('views/AboutView');
  var MainMenuView  = require('views/MainMenuView');
  var demoView      = require('views/demoView');
  var GameLogic     = require('views/GameLogic');

  function MenuView() {
    View.apply(this, arguments);

    this.views = {};
    this.playingDemo = true;


    _createIntro.call(this);    
    _createGameboard.call(this);
    _createAbout.call(this);
    _createMainMenu.call(this);
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
    // this.lightbox.show(this.views.mainMenu);
    this.lightbox.show(this.views.demoView);
  }

  function _setLightboxListeners() {
    this.views.mainMenu.pipe(this);
    this.views.about.pipe(this);
    this.views.demoView.pipe(this);
    this.game.pipe(this);
    // this.views.game.pipe(this);

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
        this.lightbox.show(this.views.mainMenu);
        this.playingDemo = false;
      }
    }.bind(this));


    // menu listeners
    this._eventInput.on('play', function () {
      this.lightbox.show(this.views.game);
    }.bind(this));

    this._eventInput.on('about', function () {
      this.lightbox.show(this.views.about);
    }.bind(this));

    this._eventInput.on('levels', function () {
      // do something
    }.bind(this));

    this._eventInput.on('mainMenu', function () {
      this.lightbox.show(this.views.mainMenu);
    }.bind(this));
  }

  function _createIntro () {
    var intro = new demoView();
    this.views.demoView = intro;
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
