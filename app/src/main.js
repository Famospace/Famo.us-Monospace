define(function(require, exports, module) {

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  
  var RotatingCube = require('views/RotatingCube');
  // var XyCubes = require('views/XyCubes');

  var rotatingCube = new RotatingCube();
  // var xyCubes = new XyCubes();

  var mainContext = Engine.createContext();
  mainContext.setPerspective(1000);
  mainContext.add(rotatingCube);
  // mainContext.add(xyCubes);
  

});
