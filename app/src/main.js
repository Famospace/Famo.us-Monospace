define(function(require, exports, module) {

  var Engine       = require('famous/core/Engine');  
  var RotatingCube = require('views/RotatingCube');
  var Modifier     = require('famous/core/Modifier');

  var rotatingCube = new RotatingCube();

  var modifier = new Modifier({
    origin: [0.5,0.5],
    align: [0.5,0.5]
  });

  var mainContext = Engine.createContext();

  mainContext.setPerspective(1000);
  mainContext.add(modifier).add(rotatingCube);

});
