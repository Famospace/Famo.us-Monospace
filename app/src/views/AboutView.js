define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface     = require('famous/core/Surface');
  var Modifier     = require('famous/core/Modifier');
  var Transform   = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function AboutView() {
    View.apply(this, arguments);

    _createAuthors.call(this);
    _createBackButton.call(this);
  }

  AboutView.prototype = Object.create(View.prototype);
  AboutView.prototype.constructor = AboutView;

  AboutView.DEFAULT_OPTIONS = {};

  function _createAuthors () {
    var amar = new Surface({
      content: 'Amar Patel'
    });

    var amarMod = new Modifier({
      size: [200, 200],
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: Transform.translate(0, -50, 0)
    });


    var joe = new Surface({
      content: 'Joe Dou'
    });

    var joeMod = new Modifier({
      size: [200, 200],
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: Transform.translate(0, 50, 0)
    });

    this.add(amarMod).add(amar);
    this.add(joeMod).add(joe);
  }

  function _createBackButton () {
    var back = new Surface({
      content: 'Back',
      properties: {
        border: '2px solid black',
        borderRadius: '2px'
      }
    });

    var backMod = new Modifier({
      size: [50, 50],
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    back.on('touchstart', function (data) {
        console.log('yup');
      this._eventOutput.emit('mainMenu');
    }.bind(this));

    back.on('click', function (data) {
        console.log('yup');
      this._eventOutput.emit('mainMenu');
    }.bind(this));

    this.add(backMod).add(back);

  }

  module.exports = AboutView;
});
