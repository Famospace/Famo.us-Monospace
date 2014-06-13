define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var CubeView = require('views/CubeView');

    function AppView() {
        View.apply(this, arguments);

        _createCube.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    function _createCube () {
        //should return a node->modifier->cube
        var cube = new CubeView();

        this.add(cube);
    }

    module.exports = AppView;
});
