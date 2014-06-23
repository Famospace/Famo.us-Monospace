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
    // var MenuView    = require('views/MenuView');
    var Levels          = require('../../content/levels');

    function DemoView() {
      View.apply(this, arguments);

      this.rootModifier = new Modifier();

      this.node = this.add(this.rootModifier);

      this.reusableSurfaces = [];
      this.reusableModifiers = [];


      // takes 4.5 seconds
      _startWordCrash.call(this); 

      // takes 21.5 seconds
      Timer.setTimeout(function () {
        _startDemoPlay.call(this);
        _startDemoText.call(this);
        _createSkipButton.call(this);
      }.bind(this), 5000);
    }

    DemoView.prototype = Object.create(View.prototype);
    DemoView.prototype.constructor = DemoView;

    DemoView.DEFAULT_OPTIONS = {};

    function _createSkipButton () {
      var skip = new Surface({
        size: [175, 100],
        content: 'Skip',
        properties: {
          fontWeight: 'bold',
          fontFamily: 'Helvetica',
          textAlign: 'center'
        }
      });

      var skipMod = new StateModifier({
        align: [1, 1],
        origin: [1, 1],
      });


      skip.on('touchstart', function (data) {
        this._eventOutput.emit('mainMenu');
      }.bind(this));

      skip.on('click', function (data) {
        this._eventOutput.emit('mainMenu');
      }.bind(this));

      this.node.add(skip);

    }

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
      }.bind(this), 3500);
    }

    function _startDemoText () {
      var demoTextTimer = 2000;
      var swipeTransitionable = new Transitionable(0);
      var perspecTransitionable = new Transitionable(0);
      var destroyerTellTrans = new Transitionable(0);
      var objectiveTellTrans = new Transitionable(0);

      // create swipe instructional text
      var swipeTell = new Surface({
        opacity: 0,
        properties: {
          textAlign: 'center',
          fontSize: '2rem'
        }
      });

      var swipeTellMod = new Modifier({
        size: [500, 50],
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(1000, 0, 0),
        opacity: function () {
          return swipeTransitionable.get();
        }
      });

      this.node.add(swipeTellMod).add(swipeTell);

      Timer.setTimeout(function () {
        swipeTell.setContent('Swipe to Rotate');
        swipeTransitionable.set(1, { duration: 1000, curve: Easing.inBack });
        swipeTellMod.setTransform(Transform.translate(0, 0, 0), {duration: 1500, curve: 'easeInOut'});
        swipeTransitionable.set(0, { duration: 1000, curve: Easing.inBack });
      }, demoTextTimer);

      // create perspective change instructional text
      var perspecChange = new Surface({
        opacity: 0,
        properties: {
          textAlign: 'center',
          fontSize: '2rem'
        }
      });

      var perspecChangeMod = new Modifier({
        size: [500, 50],
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(0, 0, 0),
        opacity: function () {
          return perspecTransitionable.get();
        }
      });

      this.node.add(perspecChangeMod).add(perspecChange);
      
      demoTextTimer += 2300;
      Timer.setTimeout(function () {
        perspecChange.setContent('Toggle 2D and 3D');
        perspecTransitionable.set(1, { duration: 1000, curve: Easing.inBack });
        perspecTransitionable.set(0, { duration: 1000, curve: Easing.inBack });
      }, demoTextTimer);

      // create destroyer instructional text
      var destroyerTell = new Surface({
        opacity: 0,
        properties: {
          textAlign: 'center',
          fontSize: '2rem'
        }
      });

      var destroyerTellMod = new Modifier({
        size: [500, 50],
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.translate(0, -25, 0),
        opacity: function () {
          return destroyerTellTrans.get();
        }
      });

      this.node.add(destroyerTellMod).add(destroyerTell);
      
      demoTextTimer += 2000;
      Timer.setTimeout(function () {
        destroyerTell.setContent('Crush<br/>adjacent<br/>cubes');
        destroyerTellTrans.set(1, { duration: 1000, curve: Easing.inBack });
        destroyerTellTrans.set(0, { duration: 1000, curve: Easing.inBack });
      }, demoTextTimer);

      // create game objective instructional text
      var objectiveTell = new Surface({
        opacity: 0,
        properties: {
          textAlign: 'center',
          fontSize: '2rem'
        }
      });

      var objectiveTellMod = new Modifier({
        size: [500, 50],
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        opacity: function () {
          return objectiveTellTrans.get();
        }
      });

      this.node.add(objectiveTellMod).add(objectiveTell);
      
      demoTextTimer += 3000;
      Timer.setTimeout(function () {
        objectiveTell.setContent('Clear the Cube');
        objectiveTellTrans.set(1, { duration: 1000, curve: Easing.inBack });
        objectiveTellTrans.set(0, { duration: 1000, curve: Easing.inBack });
      }, demoTextTimer);
    }

    function _startDemoPlay () {
      var demoTimer = 5000;

      // How do i pass in the board!???
        // and destroyer cube???!

      this.gameLogic = new GameLogic();
          // this.gameLogic.rotatingLogic.mainCubeSize = 250;

          // this.gameLogic.rotatingLogic.destroyer = Levels.introVideo.destroyer; 

          // this.gameLogic.rotatingLogic.smallCube = Levels.introVideo.smallCube;

      var rootMod = new Modifier();


      var demoBoardModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.multiply(
            Transform.rotate(Math.PI/2, Math.PI/2, Math.PI/2),
            Transform.translate(1500, 0, 0)
        )
      });

      this.node = this.add(rootMod);

      this.node.add(demoBoardModifier).add(this.gameLogic.rotatingLogic);
      this.gameLogic.perspectiveButtonMod.setTransform(Transform.translate(0, 2000, 0),{duration: 0, curve: 'easeInOut'});
      this.node.add(this.gameLogic.perspectiveButtonMod).add(this.gameLogic.perspectiveButton);

      // perspectiveButton slides in
      this.gameLogic.perspectiveButtonMod.setTransform(Transform.rotate(0, 0, 0),{duration: 2000, curve: 'easeInOut'});
    
      // board slides in
      demoBoardModifier.setTransform(Transform.translate(0,0,0),{duration: 2500, curve: 'easeInOut'});

      // rotate right
      demoBoardModifier.setTransform(Transform.rotate(0, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});


      // switch to 2D
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);
      
      // crush
      demoTimer += 2500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 3, 1]);
        this.gameLogic._removeSmallCube([0, 3, 1]);
      }.bind(this), demoTimer);

      // switch to 3D
      demoTimer += 2000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', false);
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // rotate up
      demoTimer += 1000;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 3 * Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // crush
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 2, 2]);
        this.gameLogic._removeSmallCube([0, 2, 2]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 1, 3]);
        this.gameLogic._removeSmallCube([0, 1, 3]);
      }.bind(this), demoTimer);

      // switch to 3D
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', false);
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // // rotate up
      demoTimer += 1000;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', true);
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // crush
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([3, 0, 3]);
        this.gameLogic._removeSmallCube([3, 0, 3]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([2, 0, 2]);
        this.gameLogic._removeSmallCube([2, 0, 2]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 500;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([1, 0, 1]);
        this.gameLogic._removeSmallCube([1, 0, 1]);
      }.bind(this), demoTimer);

      // win
      // switch to 3D
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2d', false);
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1.1,1.1,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // board slides out
      // perspectiveButton slides out
      demoTimer += 1000;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.translate(-1000, 0, 0), {duration: 1000, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.translate(-1000, 0, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      demoTimer += 500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('mainMenu');
      }.bind(this), demoTimer);

    }

    module.exports = DemoView;
});
