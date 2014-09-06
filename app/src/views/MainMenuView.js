/*
 *Creates the main menu view
 */
define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Modifier      = require('famous/core/Modifier');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GridLayout    = require('famous/views/GridLayout');

  function MainMenuView() {
    View.apply(this, arguments);

    _createTitle.call(this);
    _createGithubLink.call(this);
    _createCreatedBy.call(this);
    _createInspiredBy.call(this);
    _createPlayButton.call(this);
    _createAbout.call(this);
    // _createStarButton.call(this);
  }

  MainMenuView.prototype = Object.create(View.prototype);
  MainMenuView.prototype.constructor = MainMenuView;

  MainMenuView.DEFAULT_OPTIONS = {
    fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
  };

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

  function _createTitle () {
    var menu = new Surface({
      size: [undefined, 50],
      content: 'Famospace',
      properties: {
        fontFamily: this.options.fontFamily,
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

  function _createCreatedBy () {
    var created = new Surface({
      size: [undefined, 10],
      content: 'By ' +
                '<a href="http://www.github.com/amarpatel">Amar</a> ' +
                'and ' +
                '<a href="http://www.github.com/joedou">Joe</a>',
      properties: {
        fontFamily: this.options.fontFamily,
        textAlign: 'center',
        fontSize: '.75rem'
      }
    });
    var createdMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 130, 0)
    });

    this.add(createdMod).add(created);
  }

  function _createInspiredBy () {
    var inspired = new Surface({
      size: [undefined, 10],
      content: 'Inspired by Monospace <br/> Daniel Lutz',
      properties: {
        fontFamily: this.options.fontFamily,
        textAlign: 'center',
        fontSize: '.75rem'
      }
    });
    var inspiredMod = new StateModifier({
      align: [0.5, 0.9],
      origin: [0.5, 0.9]
    });

    this.add(inspiredMod).add(inspired);
  }

  function _createPlayButton () {
    var play = new Surface({
      size: [150, 65],
      content: 'Play',
      properties: {
        fontFamily: this.options.fontFamily,
        textAlign: 'center',
        fontSize: '3rem',
        borderRadius: '10px',
        backgroundColor: '#34A4CC',
        border: '2px solid #738F99',
        cursor: 'pointer',
        color: 'white'
      }
    });
    var playMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 230, 0)
    });

    play.on('touchstart', function () {
      this._eventOutput.emit('levels');
    }.bind(this));

    play.on('click', function () {
      this._eventOutput.emit('levels');
    }.bind(this));

    this.add(playMod).add(play);
  }

  function _createAbout () {
    var about = new Surface({
      size: [150, 65],
      content: 'About',
      properties: {
        fontFamily: this.options.fontFamily,
        textAlign: 'center',
        fontSize: '1rem',
        cursor: 'pointer'
      }
    });
    var aboutMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(0, 350, 0)
    });

    about.on('touchstart', function () {
      this._eventOutput.emit('about');
    }.bind(this));

    about.on('click', function () {
      this._eventOutput.emit('about');
    }.bind(this));

    this.add(aboutMod).add(about);
  }

  function _createStarButton () {

    var about = new Surface({
      size: [150, 65],
      content: '<iframe src="http://ghbtns.com/github-btn.html?user=Famospace&repo=Famo.us-Monospace&type=watch" allowtransparency="true" frameborder="0" scrolling="0" width="62" height="20"></iframe>',
      properties: {
        fontFamily: this.options.fontFamily,
        textAlign: 'center',
        fontSize: '1rem',
        cursor: 'pointer'
      }
    });

    var aboutMod = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, 0],
      transform: Transform.translate(4, 375, 0)
    });

    this.add(aboutMod).add(about);
  }

  module.exports = MainMenuView;
});
