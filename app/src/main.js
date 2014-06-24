define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var FpsMeter        = require('views/FpsMeterView');
  var GameLogic       = require('views/GameLogic');
  var DemoView        = require('views/DemoView');
  var MenuView        = require('views/MenuView');

  var fpsMeter        = new FpsMeter();


  var modifier = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  var perspective = 1000;

  if (window.innerWidth < 800){
    perspective = 500;
  }

  var mainContext = Engine.createContext();

  mainContext.setPerspective(perspective);

  var menuView = new MenuView();

  menuView._eventOutput.on('is2d', function (boolean) {
  if (boolean) {
      mainContext.setPerspective(1000000);
    } else {
      mainContext.setPerspective(perspective);
    }
  });

  mainContext.add(fpsMeter);


  mainContext.add(modifier).add(menuView);


});
