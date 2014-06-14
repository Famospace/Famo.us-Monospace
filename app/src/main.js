define(function(require, exports, module) {

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');
  var Timer = require('famous/utilities/Timer');
  var CubeView = require('views/CubeView');
  var MouseSync  = require("famous/inputs/MouseSync");

  var mainContext = Engine.createContext();
  mainContext.setPerspective(500);

  var surface = new Surface({
      size : [undefined, undefined]
  });

  var surfaceModifier = new Modifier({
    origin: [0,0],
    align: [0,0]
  });

  cubeModifier = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5],
    // transform : function(){
    //   return Transform.translate(0, 400, 0);
    // }
  });

  cubeRotateModifier = new Modifier({
    transform: function(){
      rotX = rotateDelta[1]/100;
      rotY =-rotateDelta[0]/100;
      // console.log('rotation angle', rotX, rotY);
      var trans = Transform.rotate(rotX,rotY, 0);
      return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2,0], trans);
    }
  });

  cube = new CubeView({
    size: 200
  });

  var sync = new MouseSync();

  var rotateDelta = [0,0];
  
  surface.pipe(sync);
  console.log('here');

  sync.on('update', function(data){
    rotateDelta[0] -= data.delta[0];
    rotateDelta[1] -= data.delta[1];
    // console.log('rotate data', rotateDelta);
  });

  // cubeSmallModifier1 = new Modifier({
  //   origin: [0.5, 0.5],
  //   align: [0.5, 0.5]
  // });
  // cubeSmallModifier1.setTransform(Transform.translate(75,25,75));

  // cubeSmall1 = new CubeView({
  //   size: 50
  // });

  mainContext.add(surfaceModifier).add(surface);

  var rotate = mainContext.add(cubeRotateModifier);
  rotate.add(cubeModifier).add(cube);
  // rotate.add(cubeSmallModifier1).add(cubeSmall1);

  for (var i=0; i<4; i++){
    for (var j=0; j<4; j++){
      for(var k=0; k<1; k++){
        var modifier = new Modifier({
          origin: [0.5, 0.5],
          align: [0.5, 0.5]
        });
        modifier.setTransform(Transform.translate(-75+i*50,-75+j*50,-75+k*50));

        var cubeSmall = new CubeView({
          size: 50
          // backgroundColor: 'blue'
        });

        rotate.add(modifier).add(cubeSmall);
      }
    }
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
