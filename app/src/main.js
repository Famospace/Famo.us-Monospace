define(function(require, exports, module) {

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');
  var Timer = require('famous/utilities/Timer');
  var CubeView = require('views/CubeView');

  var mainContext = Engine.createContext();
  mainContext.setPerspective(400);


  cubeModifier = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5]
  });

  cube = new CubeView({
    size: 200
  });

  cubeSmallModifier1 = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5]
  });
  cubeSmallModifier1.setTransform(Transform.translate(75,0,75))

  cubeSmall1 = new CubeView({
    size: 50
  });

  mainContext.add(cubeModifier).add(cube);
  mainContext.add(cubeSmallModifier1).add(cubeSmall1);

  for (var i=0; i<4; i++){
    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5]
    });
    modifier.setTransform(Transform.translate(-75+i*50,75,-75));

    var cubeSmall = new CubeView({
      size: 50,
      backgroundColor: 'blue'
    });

    mainContext.add(modifier).add(cubeSmall);
  }
  

    // var convert = Math.PI/180
    // var matrix=[];
    // var x, y, rot, scale;
    // var rotate = [
    //     [0, 0, 0],
    //     [0, 90, 0],
    //     [0, -90, 0],
    //     [0, 0, 0],
    //     [90, 0, 0],
    //     [-90, 0, 0]
    // ];
    // var size = 100;
    // var xlate = [
    //     [0, 0, size],
    //     [size, 0, 0],
    //     [-size, 0, 0],
    //     [0, 0, -size],
    //     [0, size, 0],
    //     [0, -size, 0]
    // ];
    // var xlt;

    // function originalCube() {
    //   for (var i =0; i <6; i++) {
    //     xlt = xlate[i];
    //     rot = rotate[i];
    //     matrix.push(Transform.multiply(
    //       Transform.translate(xlt[0], xlt[1], xlt[2]),
    //       Transform.rotate(rot[0]*convert, rot[1]*convert, rot[2]*convert))
    //     );
        
    //     _smod[i].setTransform(
    //       matrix[i], { duration:0 }
    //     );
    //   }
    // }
    // var rotationY =0;
    // var rotationZ = 0;
    // var matrix2;
    // function rotateCube() {
    //   for (var i = 0; i < 6; i++) {
    //     xlt = xlate[i];
    //     rot = rotate[i];
    //     matrix2 = Transform.rotate(0, rotationY*convert,rotationZ*convert);
         
    //     matrix2 = Transform.multiply(matrix2, matrix[i]);
    //     callback = function(){
    //        rotationY+=0.1;
    //        rotationZ+=0.2;
    //     }
    //      _smod[i].setTransform( matrix2, { duration: 0 }, callback);
    //   }
    // }
    
    // var _ctx = Engine.createContext();
    // _ctx.setPerspective(500);
    // var _surface = [];
    // var _smod = [];
    // for (var i = 0; i < 6; i++) {
    //     _surface[i] = new Surface({
    //         size: [size*2, size*2],
    //         content: '<h1>a</h1>',
    //         properties: {
    //             webkitBackfaceVisibility: 'visible',
    //             backfaceVisibility: 'visible',
    //             border: '1px solid black',
    //             opacity: 0.9
    //         }
    //     });
    //     _surface[i].addClass("backface")
    //     _smod[i] = new Modifier({
    //         origin: [0.5, 0.5]
    //     });
    //     _ctx.add(_smod[i]).add(_surface[i]);
    // }
    // originalCube();
    // Timer.setInterval(rotateCube, 20);

});
