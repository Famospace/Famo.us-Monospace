define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface     = require('famous/core/Surface');
  var Modifier     = require('famous/core/Modifier');
  var Transform   = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GridLayout = require("famous/views/GridLayout");

  function MainMenuView() {
    View.apply(this, arguments);

    _createTitle.call(this);
    _createInspiredBy.call(this);
    _createPlayButton.call(this);
    _createAbout.call(this);
  }

  MainMenuView.prototype = Object.create(View.prototype);
  MainMenuView.prototype.constructor = MainMenuView;

  MainMenuView.DEFAULT_OPTIONS = {};

  function _createTitle () {
    var menu = new Surface({
      size: [undefined, 50],
      content: 'Famospace',
      properties: {
        fontFamily: 'HelveticaNeue-Light',
        textAlign: 'center',
        fontSize: '2.5rem'
      }
    });
    var menuMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 75, 0)
    });
    
    this.add(menuMod).add(menu);
  }

  function _createInspiredBy () {
    var inspired = new Surface({
      size: [undefined, 10],
      content: 'Inspired by Daniel Lutz',
      properties: {
        fontFamily: 'HelveticaNeue-Light',
        textAlign: 'center',
        fontSize: '.75rem'
      }
    });
    var inspiredMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 130, 0)
    });
    
    this.add(inspiredMod).add(inspired);
  }

  function _createPlayButton () {
    var play = new Surface({
      size: [150, 65],
      content: 'Play',
      properties: {
        fontFamily: 'HelveticaNeue-Light',
        textAlign: 'center',
        fontSize: '3rem',
        border: '2px solid black',
        borderRadius: '10px'
      }
    });
    var playMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 230, 0)
    });

    play.on('touchstart', function (data) {
      this._eventOutput.emit('levels');
    }.bind(this));

    play.on('click', function (data) {
      this._eventOutput.emit('levels');
    }.bind(this));
    
    this.add(playMod).add(play);
  }

  function _createAbout () {
    var about = new Surface({
      size: [150, 65],
      content: 'About',
      properties: {
        fontFamily: 'HelveticaNeue-Light',
        textAlign: 'center',
        fontSize: '1rem'
      }
    });
    var aboutMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 400, 0)
    });

    about.on('touchstart', function (data) {
      this._eventOutput.emit('about');
    }.bind(this));

    about.on('click', function (data) {
      this._eventOutput.emit('about');
    }.bind(this));
    
    this.add(aboutMod).add(about);
  }

  module.exports = MainMenuView;
});