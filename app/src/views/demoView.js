define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Timer   = require('famous/utilities/Timer');
    var Modifier        = require('famous/core/Modifier');
    var GameLogic       = require('views/GameLogic');








    function DemoView() {
      View.apply(this, arguments);

      this.rootModifier = new Modifier();

      this.node = this.add(this.rootModifier);

      this.reusableSurfaces = [];

      Timer.setTimeout(function () {_createDemoBoard.call(this);}.bind(this), 5000);
      _startDemoPlay.call(this);
    }

    DemoView.prototype = Object.create(View.prototype);
    DemoView.prototype.constructor = DemoView;

    DemoView.DEFAULT_OPTIONS = {};

    function _createDemoBoard () {

      this.gameLogic = new GameLogic();
      var modifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
      });

      this.node.add(modifier).add(this.gameLogic);

    }

    function _startWordCrash () {
      var surfaceOne = new Surface({
        size: [150, 100],
        content: 'ONE'
      });

      var surfaceOneMod = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });


    // words crash down
    //   some words
    // words slide out
    }

    function _startDemoPlay () {
    // board slides in
    //   demo starts
    //     rotate twice
    //       one X
    //       one Y
    //     switch to 2D
    //       crush
    //     switch to 3D
    //       crush
    //       crush
    //       crush
    //     win
    }

    function _removeBoard () {
    // board slides out
    }

    function _showMenu () {
    // menu slides in
    }

    module.exports = DemoView;
});
