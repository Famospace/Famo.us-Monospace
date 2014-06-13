define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var Modifier     = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer = require('famous/utilities/Timer');
    var MouseSync  = require("famous/inputs/MouseSync");

    var CubeView = require('views/CubeView');

    function AppView() {
        View.apply(this, arguments);

        var cube = new CubeView();

        var backgroundSurface = new Surface({
            size: [undefined, undefined]
        });

        var sync = new MouseSync();

        backgroundSurface.pipe(sync);

        var position = [0, 0];

        sync.on('update', function (data) {
            position[0] += data.delta[0];
            position[1] -= data.delta[1];
            console.log(position);
        });

        var rotateModifier = new Modifier({
            transform: function () {
                var trans = Transform.rotate(position[1]/100, position[0]/100, 0);
                return Transform.aboutOrigin([window.innerWidth/2, window.innerHeight/2, 0], trans);
            }
        });

        this.add(backgroundSurface);
        this.add(rotateModifier).add(cube);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    module.exports = AppView;
});
