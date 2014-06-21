define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transitionable  = require('famous/transitions/Transitionable');
    var Timer           = require('famous/utilities/Timer');
    var Modifier        = require('famous/core/Modifier');
    var GameLogic       = require('views/GameLogic');
    var RotatingLogic       = require('views/RotatingLogic');


    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);

    function DemoView() {
      View.apply(this, arguments);

      this.rootModifier = new Modifier();

      this.node = this.add(this.rootModifier);

      this.reusableSurfaces = [];
      this.reusableModifiers = [];

      // Timer.setTimeout(function () {_createDemoBoard.call(this);}.bind(this), 5000);
      // _startWordCrash.call(this);

      // Timer.setTimeout(function () {
        _startDemoPlay.call(this);
      // }.bind(this), 1000);
    }

    DemoView.prototype = Object.create(View.prototype);
    DemoView.prototype.constructor = DemoView;

    DemoView.DEFAULT_OPTIONS = {};

    function _createDemoBoard () {

      this.gameLogic = new GameLogic();
      var modifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(1000, 0, 0)
      });

      this.node.add(modifier).add(this.gameLogic);

    }

    function _startWordCrash () {
      var transitionable = new Transitionable(0);

      var words = ['ONE', 'TWO', 'THREE'];

      // words crash down
      for (var i=0;i<words.length;i++) {

        var surface = new Surface({
          size: [150, 100],
          content: words[i]
        });

        var surfaceMod = new StateModifier({
          align: [0.5, 0],
          origin: [0.5, 0],
        });

        this.reusableSurfaces.push(surface);
        this.reusableModifiers.push(surfaceMod);
        
        this.node.add(this.reusableModifiers[i]).add(this.reusableSurfaces[i]);


      }

      Timer.setTimeout(function () {
        this.reusableModifiers[0].setTransform(
          Transform.translate(0, window.innerHeight/2 - 150, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
      }.bind(this), 50);

      Timer.setTimeout(function () {
        this.reusableModifiers[1].setTransform(
          Transform.translate(0, window.innerHeight/2 - 100, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
      }.bind(this), 100);

      Timer.setTimeout(function () {
        this.reusableModifiers[2].setTransform(
          Transform.translate(0, window.innerHeight/2 - 50, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
      }.bind(this), 150);




      // words slide out
      Timer.setTimeout(function () {
        this.reusableModifiers[0].setTransform(
          Transform.translate(-100, 0, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
        this.reusableModifiers[1].setTransform(
          Transform.translate(-100, 0, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
        this.reusableModifiers[2].setTransform(
          Transform.translate(-100, 0, 0),
              { method: 'spring', period: 600, dampingRatio: 0.15 }
        );
      }.bind(this), 250);     


    }

    function _startDemoPlay () {

    // board slides in

      var demoBoard = new RotatingLogic({
          mainCubeSize: 250,
          destroyer: [0, 0, 0], 
          smallCube: [[3, 0, 0], [0, 1, 0], [3, 2, 1]]
      });
      this.node.add(this.rotatingLogic);

      var demoBoardModifier = new StateModifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(1000, 0, 0)
      });

      this.node.add(demoBoardModifier).add(demoBoard);

        var perspectiveButton = new Surface({
          size: [undefined, undefined],
          content: '<div>2D</div>',
          properties: {
            fontSize: '3rem',
            textAlign: 'center',
            lineHeight: '75px',
            verticalAlign: 'middle',
            color: 'red',
            backgroundColor: 'black',
            borderRadius: '20px',
            cursor: 'pointer'
          }
        });


        var perspecModifier = new Modifier ({
            size: function () {
              if (((window.innerWidth - this.options.mainCubeSize) / 2) < 150) {
                return [100, 75];
              } else {
                return [75, 75];
              }
            }.bind(this),
            align: [0.5, 0.5],
            origin: function () {
              if (((window.innerWidth - this.options.mainCubeSize) / 2) < 150) {
                return [0.5, 0.95];
              } else {
                return [0.05, 0.5];
              }
            }.bind(this),
        });

        // perspectiveButton.on('click', function () {
        //     if (this.is2d === false && _ableToConvertTo2d.call(this) === true) {
        //         this._eventOutput.trigger('is2d', true);
        //         perspectiveButton.setContent('3D');
        //         this.is2d = !this.is2d;
        //     } else if (this.is2d === false && _ableToConvertTo2d.call(this) === false) {
        //         _deny3D.call(this);
        //     } else {
        //         this._eventOutput.trigger('is2d', false);
        //         perspectiveButton.setContent('2D');
        //         this.is2d = !this.is2d;
        //         _convertTo3d.call(this);
        //     }
        // }.bind(this));

        this.node.add(perspecModifier).add(perspectiveButton);


    //     board slides in
      demoBoardModifier.setTransform(Transform.rotate(Math.PI, 0, -Math.PI/2),{duration: 2000, curve: 'easeInOut'});

    //     rotate twice
      demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 0, -Math.PI/2), {duration: 1000, curve: 'easeInOut'});
      demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 0, -Math.PI), {duration: 1000, curve: 'easeInOut'});

    //     switch to 2D

      // Timer.setTimeout(function () {
      //   this._eventOutput.emit('is2d', true);
      //   perspectiveButton.setContent('3D');
      //   perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'})
      //   perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'})
      // }.bind(this), 4500);



      //       crush
      //     switch to 3D

      // Timer.setTimeout(function () {
      //   this._eventOutput.emit('is2d', false);
      //   perspectiveButton.setContent('2D');
      //   perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'})
      //   perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'})
      // }.bind(this), 7000);

      // rotate three more times

      // Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 0, -Math.PI/2), {duration: 1000, curve: 'easeInOut'});
        demoBoardModifier.setTransform(Transform.rotate(0, Math.PI, Math.PI/2), {duration: 1000, curve: 'easeInOut'});
        // demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 0, -Math.PI/2), {duration: 1000, curve: 'easeInOut'});
      // }.bind(this), 7500);



      //       crush
      //       crush
      //       crush
      //     win

      // Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.translate(-1000, 0, 0), {duration: 1000, curve: 'easeInOut'});
      // }.bind(this), 12000);
    }

    function _removeBoard () {
    // board slides out
    }

    function _showMenu () {
    // menu slides in
    }

    module.exports = DemoView;
});
