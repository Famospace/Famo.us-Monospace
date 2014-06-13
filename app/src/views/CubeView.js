define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Timer = require('famous/utilities/Timer');
    var Transitionable = require('famous/transitions/Transitionable')


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
    }

    CubeView.prototype = Object.create(View.prototype);
    CubeView.prototype.constructor = CubeView;

    CubeView.DEFAULT_OPTIONS = {
      size: 100,
      convert: Math.PI/180
    };

    module.exports = CubeView;

    function _createCube () {

      this.surfaceTranslations = [
      // front
      [0, 0, this.options.size],
      // back
      [0, 0, -this.options.size],

      // left
      [this.options.size, 0, 0],
      // right
      [-this.options.size, 0, 0],

      // top
      [0, this.options.size, 0],
      // bottom
      [0, -this.options.size, 0]

      ];

      this.surfaceRotations = [
      // front
      [0, 0, 0],
      // back
      [0, 0, 0],

      // left
      [0, 90, 0],
      // right
      [0, -90, 0],

      // top
      [90, 0, 0],
      // bottom
      [-90, 0, 0]
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
            opacity: 0.9,
            pointerEvents: 'none'
          }
        });

        this.surfaces.push(surface);


    // create initial cube modifiers
        var surfaceModifier = new Modifier({
          // size: [100, 100],
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



    // create rotational cube modifiers


});