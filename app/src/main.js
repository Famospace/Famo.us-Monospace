define(function(require, exports, module) {

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  
  var CubeView = require('views/CubeView');
  var AppView = require('views/AppView');

  var appView = new AppView();

  var mainContext = Engine.createContext();
  mainContext.setPerspective(500);
  mainContext.add(appView);
  

});
