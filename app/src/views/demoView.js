/* This view is created for a play by play demo to teach user how to play the game.  Game play
   is manually injected and used timer to breakout each moves
*/
define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transitionable  = require('famous/transitions/Transitionable');
    var Timer           = require('famous/utilities/Timer');
    var Modifier        = require('famous/core/Modifier');
    var Easing          = require('famous/transitions/Easing');
    var Buzz            = require('buzz');
    var GameLogic       = require('views/GameLogic');
    var RotatingLogic   = require('views/RotatingLogic');
    var Levels          = require('../../content/levels');

    function DemoView() {
      View.apply(this, arguments);

      this.rootModifier = new Modifier();

      this.node = this.add(this.rootModifier);

      this.crashTextMods = [];

      // allows sounds to be muted if demo is skipped
      this.skip = false;
      
      //inject sound for 2/3d transition
      this.transitionSound = new Buzz.sound("content/sounds/swooshing-punch.wav",{
        preload: true
      });

      // takes 5.1 seconds
      // start demo after 5 seconds
      _createSkipButton.call(this);
      _startWordCrash.call(this);

      console.log(this);

      // takes 21.5 seconds
      Timer.setTimeout(function () {
        if(!this.skip){
          _startDemoPlay.call(this);
          _startDemoText.call(this);
        }
      }.bind(this), 6000);
    }

    DemoView.prototype = Object.create(View.prototype);
    DemoView.prototype.constructor = DemoView;

    DemoView.DEFAULT_OPTIONS = {
      crashTextProps: {
        fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
        textAlign: 'center',
        fontSize: '1.2rem'
      }
    };
    
    // skip button for user to skip the demo and move to menu page
    function _createSkipButton () {
      var skip = new Surface({
        size: [25, 25],
        content: 'Skip',
        properties: {
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          textAlign: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }
      });

      var skipMod = new StateModifier({
        align: [1, 0],
        origin: [1, 0],
        transform: Transform.translate(-22, 0, 0)
      });

      skip.on('touchstart', function (data) {
        this.skip = true;
        this._eventOutput.emit('demoToMainMenu');
      }.bind(this));

      skip.on('click', function (data) {
        this.skip = true;
        this._eventOutput.emit('demoToMainMenu');
      }.bind(this));

      Timer.setTimeout(function () {
        skipMod.setOpacity(0, {curve: 'easeInOut', duration: 250});
      }.bind(this), 25000);

      this.node.add(skipMod).add(skip);

    }

    function _startWordCrash () {

      // words crash down
      var crush = new Surface({
        size: [200, 100],
        content: 'Crush the Grey Cubes',
        properties: this.options.crashTextProps
      });

      var crushMod = new StateModifier({
        align: [0.5, 0],
        origin: [0.5, 0],
        transform: Transform.multiply(
          Transform.rotateY(Math.PI/2),
          Transform.translate(100, window.innerHeight/2 - 50, 400)
        )
      });

      var manipulate = new Surface({
        size: [200, 100],
        content: 'Manipulate in 3D',
        properties: this.options.crashTextProps
      });

      var manipulateMod = new StateModifier({
        align: [0.5, 0],
        origin: [0.5, 0],
        transform: Transform.multiply(
          Transform.rotateX(-Math.PI/2),
          Transform.translate(0, window.innerHeight/2 + 1000, 1000)
        )
      });

      var destroy = new Surface({
        size: [200, 100],
        content: 'Destroy in 2D',
        properties: this.options.crashTextProps
      });

      var destroyMod = new StateModifier({
        align: [0.5, 0],
        origin: [0.5, 0],
        transform: Transform.multiply(
          Transform.rotateY(-Math.PI/2),
          Transform.translate(100, window.innerHeight/2 + 50, 400)
        )
      });

      this.crashTextMods.push(crushMod);
      this.crashTextMods.push(manipulateMod);
      this.crashTextMods.push(destroyMod);
      this.node.add(this.crashTextMods[0]).add(crush);
      this.node.add(this.crashTextMods[1]).add(manipulate);
      this.node.add(this.crashTextMods[2]).add(destroy);     

      Timer.setTimeout(function () {
        this.crashTextMods[0].setTransform(
          Transform.multiply(
            Transform.translate(0, window.innerHeight/2 - 50, 0),
            Transform.rotateY(0)
          ),
          {duration: 1000, curve: 'easeInOut'}
        );
      }.bind(this), 650);

      Timer.setTimeout(function () {
        this.crashTextMods[1].setTransform(
          Transform.multiply(
            Transform.translate(0, window.innerHeight/2, 0),
            Transform.rotateX(0)
          ),
          {duration: 1000, curve: 'easeInOut'}
        );
      }.bind(this), 2150);

      Timer.setTimeout(function () {
        this.crashTextMods[2].setTransform(
          Transform.multiply(
            Transform.translate(0, window.innerHeight/2 + 50, 0),
            Transform.rotateY(0)
          ),
          {duration: 1000, curve: 'easeInOut'}
        );
      }.bind(this), 3650);

      // words slide out
      Timer.setTimeout(function () {
        this.crashTextMods[0].setOpacity(
          0,
              {duration: 500, curve: Easing.inCubic}
        );
        this.crashTextMods[1].setOpacity(
          0,
              {duration: 500, curve: Easing.inCubic}
        );
        this.crashTextMods[2].setOpacity(
          0,
              {duration: 500, curve: Easing.inCubic}
        );
      }.bind(this), 5500);
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
          fontSize: '2rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 30
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
          fontSize: '2rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 30
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
        perspecChange.setContent('Toggle<br/>2D and 3D');
        perspecTransitionable.set(1, { duration: 1000, curve: Easing.inBack });
        perspecTransitionable.set(0, { duration: 1000, curve: Easing.inBack });
      }, demoTextTimer);

      // create destroyer instructional text
      var destroyerTell = new Surface({
        opacity: 0,
        properties: {
          textAlign: 'center',
          fontSize: '2rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 30
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
          fontSize: '2rem',
          fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
          zIndex: 30
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

      this.gameLogic = new GameLogic();

      this.gameLogic.startNewGame({level: Levels.introVideo});

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
        this._eventOutput.emit('is2dDemo', true);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);
      
      // crush
      demoTimer += 2700;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 3, 1]);
        this.gameLogic._removeSmallCube([0, 3, 1]);
      }.bind(this), demoTimer);

      // switch to 3D
      demoTimer += 2000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2dDemo', false);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // rotate up
      demoTimer += 1200;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI/2, 3 * Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2dDemo', true);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // crush
      demoTimer += 1200;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 2, 2]);
        this.gameLogic._removeSmallCube([0, 2, 2]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 600;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([0, 1, 3]);
        this.gameLogic._removeSmallCube([0, 1, 3]);
      }.bind(this), demoTimer);

      // switch to 3D
      demoTimer += 1000;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2dDemo', false);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // // rotate up
      demoTimer += 1200;
      Timer.setTimeout(function () {
        demoBoardModifier.setTransform(Transform.rotate(Math.PI, -Math.PI/2, 0), {duration: 1000, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // switch to 2D
      demoTimer += 1500;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2dDemo', true);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('3D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(1,1,1), {duration: 200, curve: 'easeInOut'});
      }.bind(this), demoTimer);

      // crush
      demoTimer += 1200;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([3, 0, 3]);
        this.gameLogic._removeSmallCube([3, 0, 3]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 600;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([2, 0, 2]);
        this.gameLogic._removeSmallCube([2, 0, 2]);
      }.bind(this), demoTimer);

      // crush
      demoTimer += 600;
      Timer.setTimeout(function () {
        this.gameLogic.rotatingLogic.setDestroyerPosition([1, 0, 1]);
        this.gameLogic._removeSmallCube([1, 0, 1]);
      }.bind(this), demoTimer);

      // win
      // switch to 3D
      demoTimer += 1200;
      Timer.setTimeout(function () {
        this._eventOutput.emit('is2dDemo', false);
        if(!this.skip){this.transitionSound.play()};
        this.gameLogic.perspectiveButton.setContent('2D');
        this.gameLogic.perspectiveButtonMod.setTransform(Transform.scale(0.95,0.95,1), {duration: 200, curve: 'easeInOut'});
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
        this._eventOutput.emit('demoToMainMenu');
      }.bind(this), demoTimer);

    }

    module.exports = DemoView;
});
