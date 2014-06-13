
// This view should:

//   create a cube

//   maybe:
//     rotate cube



define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Timer = require('famouss/')

    function CubeView() {
        View.apply(this, arguments);

        this.rotationY = 0;
        this.rotationZ = 0;
        this.surfaces = [];
        this.surfaceModifiers = [];
        this.matrix = [];
        this.surfaceTranslations = undefined;
        this.surfaceRotations = undefined;

        _createCube.call(this);
        _rotateCube.call(this);

        
    }

    CubeView.prototype = Object.create(View.prototype);
    CubeView.prototype.constructor = CubeView;

    CubeView.DEFAULT_OPTIONS = {
      size: 100,
      convert: Math.PI/180
    };

    module.exports = CubeView;

    function _createCube () {

      this.surfaceTranslations = this.surfaceTranslations || [
      // front
      [0, 0, this.options.size],
      // back
      [0, 0, -this.options.size],

      // left
      [-this.options.size, 0, 0],
      // right
      [this.options.size, 0, 0],

      // top
      [0, this.options.size, 0],
      // bottom
      [0, -this.options.size, 0]

      ];

      this.surfaceRotations = this.surfaceRotations || [
      // front
      [0, 0, 90],
      // back
      [0, 0, -90],

      // left
      [-90, 0, 0],
      // right
      [90, 0, 0],

      // top
      [0, 90, 0],
      // bottom
      [0, -90, 0]
      ];

      for (var i=0;i<6;i++) {

    // create initial cube surfaces
        var surface = new Surface({
          size: [this.options.size*2, this.options.size*2],
          content: '<h1>FRONT</h1>',
          properties: {
            webkitBackfaceVisibility: 'visible',
            backfaceVisibility: 'visible',
            border: '1px solid black',
            opacity: 0.9
          }
        });

        this.surfaces.push(surface);


    // create initial cube modifiers
        var surfaceModifier = new Modifier({
          size: [100, 100],
          align: [0.5, 0.5],
          origin: [0.5, 0.5]
        });

        this.surfaceModifiers.push(surfaceModifier);

    // add to view's context for presentation
        this.add(surfaceModifier).add(surface);

      }

      for (var j=0;j<6;j++) {
        var currentSurface = this.surfaceTranslations[j];
        var currentRotation = this.surfaceRotations[j];

        var matrixData = 
          Transform.multiply(
            Transform.translate(
              currentSurface[0], 
              currentSurface[1], 
              currentSurface[2]
            ),
            Transform.rotate(
              currentRotation[0] * this.options.convert, 
              currentRotation[1] * this.options.convert, 
              currentRotation[2] * this.options.convert
            )
          );


        this.matrix.push(matrixData);

        this.surfaceModifiers[j].setTransform(
          matrixData,
          { duration: 0 }
        );
      }


    }

    function _rotateCube () {
      for (var i = 0; i < 6; i++) {
        var currentSurface = this.surfaceTranslations[i];
        var currentRotation = this.surfaceRotations[i];
        var rotationMatrix;
        rotationMatrix = Transform.rotate(0, this.rotationY*this.options.convert,this.rotationZ*this.options.convert);
        rotationMatrix = Transform.multiply(rotationMatrix, this.matrix[i]);
        
        this.surfaceModifiers[i].setTransform( 
          rotationMatrix, 
          { duration: 0 }, 
          function(){
            this.rotationY+=0.1;
            this.rotationZ+=0.2;
          }
        );
      }
    }



    // create rotational cube modifiers


});

/*

var convert = Math.PI/180
    var matrix=[];
    var x, y, rot, scale;
    var rotate = [
        [0, 0, 0],
        [0, 90, 0],
        [0, -90, 0],
        [0, 0, 0],
        [90, 0, 0],
        [-90, 0, 0]
    ];
    var size = 100;
    var cubeSurfaceTranslations = [
        [0, 0, size],
        [size, 0, 0],
        [-size, 0, 0],
        [0, 0, -size],
        [0, size, 0],
        [0, -size, 0]
    ];
    var xlt;

    function originalCube() {
      for (var i =0; i <6; i++) {
        xlt = cubeSurfaceTranslations[i];
        rot = rotate[i];
        matrix.push(Transform.multiply(
          Transform.translate(xlt[0], xlt[1], xlt[2]),
          Transform.rotate(rot[0]*convert, rot[1]*convert, rot[2]*convert))
        );
        
        _smod[i].setTransform(
          matrix[i], { duration:0 }
        );
      }
    }
    var rotationY =0;
    var rotationZ = 0;
    var matrix2;
    function rotateCube() {
      for (var i = 0; i < 6; i++) {
        xlt = cubeSurfaceTranslations[i];
        rot = rotate[i];
        matrix2 = Transform.rotate(0, rotationY*convert,rotationZ*convert);
         
        matrix2 = Transform.multiply(matrix2, matrix[i]);
        callback = function(){
           rotationY+=0.1;
           rotationZ+=0.2;
        }
         _smod[i].setTransform( matrix2, { duration: 0 }, callback);
      }
    }
    
    var _ctx = Engine.createContext();
    _ctx.setPerspective(500);
    var _surface = [];
    var _smod = [];
    for (var i = 0; i < 6; i++) {
        _surface[i] = new Surface({
            size: [size*2, size*2],
            content: '<h1>a</h1>',
            properties: {
                webkitBackfaceVisibility: 'visible',
                backfaceVisibility: 'visible',
                border: '1px solid black',
                opacity: 0.9
            }
        });
        _surface[i].addClass("backface")
        _smod[i] = new Modifier({
            origin: [0.5, 0.5]
        });
        _ctx.add(_smod[i]).add(_surface[i]);
    }
    originalCube();
    Timer.setInterval(rotateCube, 20);

*/