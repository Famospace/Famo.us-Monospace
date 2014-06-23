define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var FpsMeter        = require('views/FpsMeterView');
  var GameLogic       = require('views/GameLogic');
  var DemoView        = require('views/DemoView');
  var MenuView        = require('views/MenuView');

  var gameLogic = new GameLogic();

  var demoView = new DemoView();

  var fpsMeter = new FpsMeter();


  var modifier = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  var mainContext = Engine.createContext();

  mainContext.setPerspective(1000);

   //////////////// Main Menu ///////////////////

  var menuView = new MenuView();

  // menuView.views.demoView._eventOutput.on('is2d', function (boolean) {
  //   if (boolean) {
  //     mainContext.setPerspective(1000000);
  //   } else {
  //     mainContext.setPerspective(1000);
  //   }
  // });

  // menuView.views.game._eventOutput.on('is2d', function (boolean) {
  //   if (boolean) {
  //     mainContext.setPerspective(1000000);
  //   } else {
  //     mainContext.setPerspective(1000);
  //   }
  // });


  menuView._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      mainContext.setPerspective(1000000);
    } else {
      mainContext.setPerspective(1000);
    }
  });

  mainContext.add(modifier).add(menuView);


  //////////////// INTRO VIDEO ///////////////////

  // var demoView = new DemoView();
  // demoView._eventOutput.on('is2d', function (boolean) {
  //   if (boolean) {
  //     mainContext.setPerspective(1000000);
  //   } else {
  //     mainContext.setPerspective(1000);
  //   }
  // });
  // mainContext.add(modifier).add(demoView);


  /////////////////// NORMAL //////////////////////

  // var gameLogic = new GameLogic();

  // gameLogic._eventOutput.on('is2d', function (boolean) {
  //   if (boolean) {
  //     mainContext.setPerspective(1000000);
  //   } else {
  //     mainContext.setPerspective(1000);
  //   }
  // });
  // mainContext.add(modifier).add(gameLogic);
  // mainContext.add(fpsMeter);

});
