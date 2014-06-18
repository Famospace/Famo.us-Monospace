define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Timer = require('famous/utilities/Timer');
    var Transitionable = require('famous/transitions/Transitionable');


    function CubeView() {
        View.apply(this, arguments);

        // needed to add surface listeners from ancestor view
        this.surfaces = [];

        var rootModifier = new Modifier({
          size: [this.options.size, this.options.size],
          translate: Transform.translate([this.options.size/2,this.options.size/2, this.options.size/2])
        });

        this.rootNode = this.add(rootModifier);

        _createCube.call(this);
    }

    CubeView.prototype = Object.create(View.prototype);
    CubeView.prototype.constructor = CubeView;

    CubeView.DEFAULT_OPTIONS = {
      size: 200,
      convert: Math.PI/180
    };

    module.exports = CubeView;

    function _createCube () {

      var surfaceTranslations = [
        [0, 0, this.options.size], // front
        [0, 0, -this.options.size], // back
        [this.options.size, 0, 0], // right
        [-this.options.size, 0, 0], // left
        [0, this.options.size, 0], // bottom
        [0, -this.options.size, 0] // top
      ];

      var surfaceRotations = [
        [0, 0, 0],// front
        [0, 0, 0], // back
        [0, Math.PI/2, 0],// right
        [0, -Math.PI/2, 0], // left
        [Math.PI/2, 0, 0],// bottom
        [-Math.PI/2, 0, 0]// top
      ];
      var letters = ['Z', '-Z', 'X', '-X', 'Y', '-Y'];

      for (var i=0;i<6;i++) {

        // create initial cube surfaces
        var surface = new Surface({
          size: [this.options.size*2, this.options.size*2],
          content: '<p><h1>'+letters[i]+'</h1></p>',
          properties: {
            textAlign: 'center',
            webkitBackfaceVisibility: 'visible',
            border: '1px solid black'
          }
        });

        this.surfaces.push(surface);

        // create initial cube modifiers
        var surfaceModifier = new Modifier({
          align: [0.5, 0.5],
          origin: [0.5, 0.5]
        });

        var currentSurface = surfaceTranslations[i];
        var currentRotation = surfaceRotations[i];

        var matrixData =
          Transform.multiply(
            Transform.translate(
              currentSurface[0],
              currentSurface[1],
              currentSurface[2]
            ),
            Transform.rotate(
              currentRotation[0],
              currentRotation[1],
              currentRotation[2]
            )
          );

        surfaceModifier.setTransform( matrixData, {duration: 0});

        // add to view's context for presentation
        this.rootNode.add(surfaceModifier).add(surface);
      }
    }
});