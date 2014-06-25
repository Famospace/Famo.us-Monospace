/*
 *This file instantiates the entire game.
 *This file also receives events to adjust perspective to 3D/2D
 */
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

  var mainContext = Engine.createContext();
  // default perspective is 1000; 500 for smaller devices
  var perspective = (window.innerWidth < 800) ? 500 : 1000;

  mainContext.setPerspective(perspective);

  // instantiates game
  var menuView = new MenuView();

  // transitionable for the 2D/3D change
  var perspectiveTrans = new Transitionable(perspective);

  mainContext.add(fpsMeter);
  mainContext.add(modifier).add(menuView);

  // upon receiving event, perspective is changed over 200ms
  menuView._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      // invokes function on prerender
      Engine.on('prerender', _changePerspective);
      perspectiveTrans.set(500000, {
        curve: Easing.inQuint,
        duration: 200
          // after perspective has changed, event is removed to improve performance
      }, function() { Engine.removeListener('prerender', _changePerspective); });
    } else {
      Engine.on('prerender', _changePerspective);
      perspectiveTrans.set(perspective, {
        curve: Easing.outQuint,
        duration: 200
      }, function() { Engine.removeListener('prerender', _changePerspective); });
    }
  });

  function _changePerspective() {
      mainContext.setPerspective(perspectiveTrans.get());
  }

});
