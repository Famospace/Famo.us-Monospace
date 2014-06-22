define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transitionable  = require('famous/transitions/Transitionable');
    var Timer           = require('famous/utilities/Timer');
    var Modifier        = require('famous/core/Modifier');
    var Easing          = require('famous/transitions/Easing');
    
    var GameLogic       = require('views/GameLogic');
    var RotatingLogic   = require('views/RotatingLogic');
    var Levels          = require('../../content/levels');



    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);

    function DemoView() {
      View.apply(this, arguments);

      this.rootModifier = new Modifier();

      this.node = this.add(this.rootModifier);

      this.reusableSurfaces = [];
      this.reusableModifiers = [];

      // Timer.setTimeout(function () {_createDemoBoard.call(this);}.bind(this), 20500);
      // _startWordCrash.call(this); // takes 3.5 seconds

      // Timer.setTimeout(function () {
        _startDemoPlay.call(this);
      // }.bind(this), 4000);
    }

    DemoView.prototype = Object.create(View.prototype);
    DemoView.prototype.constructor = DemoView;

    DemoView.DEFAULT_OPTIONS = {};

    function _createDemoBoard () {

      this.gameLogic = new GameLogic();
      var modifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(0, 0, 0)
      });

      this.node.add(modifier).add(this.gameLogic);

    }

    function _startWordCrash () {
      var transitionable = new Transitionable(0);

      var words = ['Crush the Red Cubes', 'Munipulate in 3D', 'Destroy in 2D'];

      // words crash down
      for (var i=0;i<words.length;i++) {

        var surface = new Surface({
          size: [175, 100],
          content: words[i],
          properties: {
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
            textAlign: 'center'
          }
        });

        var surfaceMod = new StateModifier({
          align: [0.5, 0],
          origin: [0.5, 0],
        });

        this.reusableSurfaces.push(surface);
        this.reusableModifiers.push(surfaceMod);
        
        this.node.add(this.reusableModifiers[i]).add(this.reusableSurfaces[i]);
      }

      this.reusableModifiers[0].setTransform(
        Transform.translate(0, window.innerHeight/2 - 150, 0),
            {duration: 1000, curve: Easing.outBack}
      );

      this.reusableModifiers[1].setTransform(
        Transform.translate(0, window.innerHeight/2 - 100, 0),
            {duration: 1000, curve: Easing.outBack}
      );

      this.reusableModifiers[2].setTransform(
        Transform.translate(0, window.innerHeight/2 - 50, 0),
            {duration: 1000, curve: Easing.outBack}
      );

      // words slide out
      Timer.setTimeout(function () {
        this.reusableModifiers[0].setTransform(
          Transform.translate(0, 2000, 0),
              {duration: 1000, curve: Easing.inBack}
        );
        this.reusableModifiers[1].setTransform(
          Transform.translate(0, 2000, 0),
              {duration: 1000, curve: Easing.inBack}
        );
        this.reusableModifiers[2].setTransform(
          Transform.translate(0, 2000, 0),
              {duration: 1000, curve: Easing.inBack}
        );
      }.bind(this), 2500);
    }

    function _startDemoPlay () {

      var demoTimer = 4000;

      // How do i pass in the board!???
        // and destroyer cube???!

      this.gameLogic = new GameLogic();
          // this.gameLogic.rotatingLogic.mainCubeSize = 250;

          // this.gameLogic.rotatingLogic.destroyer = Levels.introVideo.destroyer; 

          // this.gameLogic.rotatingLogic.smallCube = Levels.introVideo.smallCube;
      var demoBoardModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.multiply(
            Transform.rotate(Math.PI/2, Math.PI/2, Math.PI/2),
            Transform.translate(1000, 0, 0)
        )
      });

    // board slides in
      // var demoBoard = new RotatingLogic({
      //     mainCubeSize: 250,
      //     destroyer: Levels.introVideo.destroyer, 
      //     smallCube: Levels.introVideo.smallCube
      // });
      // this.node.add(this.rotatingLogic);

      // var demoBoardModifier = new StateModifier({
      //   align: [0.5, 0.5],
      //   origin: [0.5, 0.5],
      //   transform: Transform.multiply(
      //       Transform.rotate(Math.PI/2, Math.PI/2, Math.PI/2),
      //       Transform.translate(1000, 0, 0)
      //   )
      // });

      this.node.add(demoBoardModifier).add(this.gameLogic.rotatingLogic);

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
            transform: Transform.translate(0, 2000, 0),
            size: function () {
              if (((window.innerWidth - this.options.mainCubeSize) / 2) < 150) {
                return [100, 75];
              } else {
                return [75, 75];
              }
            }.bind(this),
            align: function () {
              if (((window.innerWidth - this.options.mainCubeSize) / 2) < 150) {
                return [0.5, 0.5];
              } else {
                return [0.5, 0.5];
              }
            }.bind(this),
            origin: function () {
              if (((window.innerWidth - this.options.mainCubeSize) / 2) < 150) {
                return [0.5, 0.95];
              } else {
                return [0.05, 0.5];
              }
            }.bind(this),
        });

        this.node.add(perspecModifier).add(perspectiveButton);

        // perspectiveButton slides in
      perspecModifier.setTransform(Transform.rotate(0, 0, 0),{duration: 2000, curve: 'easeInOut'});
    
    //     board slides in
      demoBoardModifier.setTransform(Transform.translate(0,0,0),{duration: 2000, curve: 'easeInOut'});
      

    //     rotate right
      demoBoardModifier.setTransform(Transform.rotate(0, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});

    //     switch to 2D
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        perspectiveButton.setContent('3D');
        perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);
      
      //       crush
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 3, 1]);
        this.gameLogic._removeSmallCube([0, 3, 1]);
      }.bind(this), demoTimer);

      //     switch to 3D
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', false);
        perspectiveButton.setContent('2D');
        perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // rotate up
      demoTimer += 1000;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      //     switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        perspectiveButton.setContent('3D');
        perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      //   crush
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 2, 2]);
        this.gameLogic._removeSmallCube([0, 2, 2]);
      }.bind(this), demoTimer);

      //   crush
      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 1, 3]);
        this.gameLogic._removeSmallCube([0, 1, 3]);
      }.bind(this), demoTimer);

    //     switch to 3D
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', false);
        perspectiveButton.setContent('2D');
        perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);


      // rotate up
      demoTimer += 1000;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      //     switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        perspectiveButton.setContent('3D');
        perspecModifier.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        perspecModifier.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      //   crush
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([3, 0, 3]);
        this.gameLogic._removeSmallCube([3, 0, 3]);
      }.bind(this), demoTimer);

      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([2, 0, 2]);
        this.gameLogic._removeSmallCube([2, 0, 2]);
      }.bind(this), demoTimer);

      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([1, 0, 1]);
        this.gameLogic._removeSmallCube([1, 0, 1]);
      }.bind(this), demoTimer);


      //     win
      // Timer.setTimeout(function () {
      //   demoBoardModifier.setTransform(Transform.translate(-1000, 0, 0), {duration: 1000, curve: 'easeInOut'});
      // }.bind(this), 16000);

    }

    function _removeBoard () {
    // board slides out
    }

    function _showMenu () {
    // menu slides in
    }

    module.exports = DemoView;
});
