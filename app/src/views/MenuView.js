define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface     = require('famous/core/Surface');
  var Modifier     = require('famous/core/Modifier');
  var Transform   = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function MenuView() {
    View.apply(this, arguments);

    _createTitle.call(this);
  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  MenuView.DEFAULT_OPTIONS = {};

  function _createTitle () {
    var titleSurface = new Surface({
      content: 'Famonospace',
      properties: {
        backgroundColor: 'black'
      }
    });

    var titleSurfaceMod = new Modifier({
      size: [undefined, undefined],
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    this.add(titleSurfaceMod).add(titleSurfaceMod);
  }

  module.exports = MenuView;
});