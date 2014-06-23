define(function(require, exports, module) {
  var View      = require('famous/core/View');
  var Surface     = require('famous/core/Surface');
  var Modifier     = require('famous/core/Modifier');
  var Transform   = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GridLayout = require("famous/views/GridLayout");

  function AboutView() {
    View.apply(this, arguments);

    _createAuthors.call(this);
    // _createBackButton.call(this);
  }

  AboutView.prototype = Object.create(View.prototype);
  AboutView.prototype.constructor = AboutView;

  AboutView.DEFAULT_OPTIONS = {};

  function _createAuthors () {

    var grid = new GridLayout({
      dimensions: [2, 1]
    });

    var surfaces = [];
    grid.sequenceFrom(surfaces);

    var amar = new Surface({
        content: '<br/><h2>Amar Patel</h2><center><img width="85%" src="http://www.amarpatel.io/content/images/2014/Jun/Amar-2.png"/></center><span display="inline-block"><a href="http://www.github.com/theamarpatel"><img width="20%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.github.com/theamarpatel"><img width="20%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.amarpatel.io/">www.AmarPatel.io</a>',
        size: [undefined, undefined],
        properties: {
          backgroundColor: 'white',
          borderRight: '1px solid lightgrey',
          color: "#404040",
          lineHeight: '50px',
          textAlign: 'center',
          fontFamily: "HelveticaNeue-Light"
        }
    });

    var joe = new Surface({
        content: '<br/><h2>Amar Patel</h2><center><img width="85%" src="http://www.amarpatel.io/content/images/2014/Jun/Amar-2.png"/></center><span display="inline-block"><a href="http://www.github.com/theamarpatel"><img width="20%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.github.com/theamarpatel"><img width="20%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.amarpatel.io/">www.AmarPatel.io</a>',
        size: [undefined, undefined],
        properties: {
          backgroundColor: 'white',
          color: "#404040",
          lineHeight: '50px',
          textAlign: 'center',
          fontFamily: "HelveticaNeue-Light"
        }
    });

    surfaces.push(amar);
    surfaces.push(joe);


    this.add(grid);
  }

  function _createBackButton () {
    var back = new Surface({
      content: 'Back',
      properties: {
        border: '5px solid black',
        borderRadius: '10px'
      }
    });

    var backMod = new Modifier({
      size: [50, 50],
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    back.on('touchstart', function (data) {
      this._eventOutput.emit('mainMenu');
    }.bind(this));

    back.on('click', function (data) {
      this._eventOutput.emit('mainMenu');
    }.bind(this));

    // this.add(backMod).add(back);

  }

  module.exports = AboutView;
});
