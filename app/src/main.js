define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var Transitionable  = require('famous/transitions/Transitionable');
  var FpsMeter        = require('views/FpsMeterView');
  var GameLogic       = require('views/GameLogic');
  var MenuView        = require('views/MenuView');
  var Easing          = require('famous/transitions/Easing');

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

  var perspectiveTrans = new Transitionable(500000);

  perspectiveTrans.set(perspective,{ curve: Easing.outQuint, duration: 200});

  mainContext.add(fpsMeter);
  mainContext.add(modifier).add(menuView);

  menuView._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      Engine.on('prerender', changePerspective);
      perspectiveTrans.set(500000,{
          curve: Easing.inQuint,
          duration: 200
      }, function() {
          Engine.removeListener('prerender', changePerspective);
      });
    } else {
      Engine.on('prerender', changePerspective);
      perspectiveTrans.set(perspective,{
          curve: Easing.outQuint,
          duration: 200
      }, function() {
          Engine.removeListener('prerender', changePerspective);
      });
    }
  });




    function changePerspective() {
        mainContext.setPerspective(perspectiveTrans.get());
    }
});
