define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var FpsMeter        = require('views/FpsMeterView');
  var GameLogic       = require('views/GameLogic');
  var DemoView        = require('views/DemoView');
  //will have to move
  var LevelSelection  = require('views/LevelSelectionView');
  var Levels          = require('../content/levels');
  var Surface         = require('famous/core/Surface');


  var gameLogic = new GameLogic();

  var levelSelection = new LevelSelection();

  gameLogic.subscribe(levelSelection._eventOutput);

  var demoView = new DemoView();

  var fpsMeter = new FpsMeter();


  var modifier = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  var mainContext = Engine.createContext();

  mainContext.setPerspective(1000);


  //////////////// INTRO VIDEO ///////////////////

  // demoView._eventOutput.on('is2d', function (boolean) {
  //   if (boolean) {
  //     mainContext.setPerspective(1000000);
  //   } else {
  //     mainContext.setPerspective(1000);
  //   }
  // });
  // mainContext.add(modifier).add(demoView);



  /////////////////// NORMAL //////////////////////

  //logic to transform 3d into 2d and vice versa

  gameLogic._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      mainContext.setPerspective(1000000);
    } else {
      mainContext.setPerspective(1000);
    }
  });
  mainContext.add(modifier).add(gameLogic);
  mainContext.add(modifier).add(levelSelection);

  mainContext.add(fpsMeter);


});
