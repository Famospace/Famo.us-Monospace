/* This is the base view to create all the cubes in this application*/
define(function(require, exports, module) {
  var View           = require('famous/core/View');
  var Surface        = require('famous/core/Surface');
  var Transform      = require('famous/core/Transform');
  var Modifier       = require('famous/core/Modifier');
  var Group          = require('famous/core/Group');

  function CubeView() {
    View.apply(this, arguments);

    // needed to add surface listeners from ancestor view
    this.surfaces = [];

    // Translate to the center of the cube
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
    size: 200
  };

  module.exports = CubeView;

  function _createCube () {

    var surfaceTranslations = [
      [0, 0, this.options.size/2], // front
      [0, 0, -this.options.size/2], // back
      [this.options.size/2, 0, 0], // right
      [-this.options.size/2, 0, 0], // left
      [0, this.options.size/2, 0], // bottom
      [0, -this.options.size/2, 0] // top
    ];

    var surfaceRotations = [
      [0, 0, 0],// front
      [0, Math.PI, 0], // back
      [0, -Math.PI/2, 0],// right
      [0, Math.PI/2, 0], // left
      [-Math.PI/2, 0, 0],// bottom
      [Math.PI/2, 0, 0]// top
    ];

    var group = new Group();

    for (var i=0;i<6;i++) {

      // create initial cube surfaces
      var surface = new Surface({
        size: [this.options.size, this.options.size],
        properties: {
          webkitBackfaceVisibility: 'visible',
          backfaceVisibility: 'visible',
          mozBackfaceVisibility: 'visible', 
          msBackfaceVisibility: 'visible',
          oBackfaceVisibility: 'visible',
          border: '1px solid black',
          pointerEvents: 'none'
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

      // translate and rotate each side of the cube to proper location
      var matrixData =
        Transform.multiply(
          Transform.translate(currentSurface[0],currentSurface[1],currentSurface[2]),
          Transform.rotate(currentRotation[0],currentRotation[1],currentRotation[2])
        );
      surfaceModifier.transformFrom( matrixData );

      // add to view's context for presentation
      group.add(surfaceModifier).add(surface);
    }
    this.rootNode.add(group);
  }
});