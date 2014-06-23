define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Lightbox      = require('famous/views/Lightbox');
  var Easing        = require('famous/transitions/Easing');

  var AboutView     = require('views/AboutView');
  var MainMenuView  = require('views/MainMenuView');
  var demoView      = require('views/demoView');
  var GameLogic       = require('views/GameLogic');

  function MenuView() {
    View.apply(this, arguments);

    this.views = {};


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
    this.lightbox.show(this.views.demoView);
  }

  function _setLightboxListeners() {
    this.views.mainMenu.pipe(this);
    this.views.about.pipe(this);
    this.views.demoView.pipe(this);
    this.views.game.pipe(this);

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
    var game = new GameLogic();
    this.views.game = game;
  }

  module.exports = MenuView;
});
