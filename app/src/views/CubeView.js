define(function(require, exports, module){
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');


  function CubeView(){
    View.apply(this, arguments);

    _createCube.call(this);
  }

  CubeView.prototype = Object.create(View.prototype);
  CubeView.prototype.constructor = CubeView;

  CubeView.DEFAULT_OPTIONS = {
    size: 200,
    backgroundColor: null
  };

  function _createCube(){
    rotate = [
      [0, 0, 0],
      [0, Math.PI/2, 0],
      [0, -Math.PI/2, 0],
      [0, 0, 0],
      [Math.PI/2, 0, 0],
      [-Math.PI/2, 0, 0]
    ];

    posTranslate = [
      [0, 0, this.options.size/2],
      [-this.options.size/2, 0, 0],
      [this.options.size/2, 0, 0],
      [0, 0, -this.options.size/2],
      [0, this.options.size/2, 0],
      [0, -this.options.size/2, 0]
    ];

    for (var i =0; i <6; i++) {
      var position = posTranslate[i];
      var rot = rotate[i];
      var trans = Transform.multiply(
        Transform.translate(position[0], position[1], position[2]),
        Transform.rotate(rotate[i][0], rotate[i][1], rotate[i][2]));
      
      modifier = new Modifier({
        origin: [0.5, 0.5]
      });

      modifier.setTransform(trans, { duration:0 });

      surface = new Surface({
        size: [this.options.size, this.options.size],
        // content: '<h1>hi</hi>',
        properties: {
          border: '1px solid black',
          backgroundColor: this.options.backgroundColor,
          webkitBackfaceVisibility: 'visible'
          // backfaceVisibility: 'visible',
          // opacity: 0.8
        }
      });

      this.add(modifier).add(surface);
    }
  }

  module.exports = CubeView;

});