/*
 *This file instantiates the entire game and 
 *receives events to adjust perspective to 3D/2D
 */
define(function(require, exports, module) {

  var Engine          = require('famous/core/Engine');
  var Modifier        = require('famous/core/Modifier');
  var MenuView        = require('views/MenuView');
  var Easing          = require('famous/transitions/Easing');

  if (typeof Howl === 'undefined') {
    console.log('Howler not loaded.  Reloading.');
    return window.location.reload(true);
  }

  var modifier = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  var mainContext = Engine.createContext();
  // default perspective is 1000; 500 for smaller devices
  var perspective = (window.innerWidth < 600 || window.innerHeight < 600) ? 500 : 1000;

  mainContext.setPerspective(perspective);

  // instantiates game
  var menuView = new MenuView();

  mainContext.add(modifier).add(menuView);

  // upon receiving event, perspective is changed over 200ms
  menuView._eventOutput.on('is2d', function (boolean) {
    if (boolean) {
      mainContext.setPerspective(500000, {duration: 200, curve: Easing.inQuint});
    } else {
      mainContext.setPerspective(perspective, {duration: 200, curve: Easing.outQuint});
    }
  });

});
