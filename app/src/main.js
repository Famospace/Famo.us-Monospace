define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var GameLogic       = require('views/GameLogic');

  var gameLogic = new GameLogic();

  var modifier = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  var mainContext = Engine.createContext();

  mainContext.setPerspective(1000);

  gameLogic._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      mainContext.setPerspective(0);
    } else {
      mainContext.setPerspective(1000);
    }
  });

  mainContext.add(modifier).add(gameLogic);

});
