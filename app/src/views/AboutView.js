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
    _createMenu.call(this);
  }

  AboutView.prototype = Object.create(View.prototype);
  AboutView.prototype.constructor = AboutView;

  AboutView.DEFAULT_OPTIONS = {};

  function _createAuthors () {

    var amar, joe;

    var grid = new GridLayout({
      dimensions: [2, 1]
    });

    var surfaces = [];
    grid.sequenceFrom(surfaces);

    if (window.innerWidth < 800) {
      amar = new Surface({
          content: '<br/><h2>Amar Patel</h2><center><img width="85%" src="content/images/amar.png"/></center><span display="inline-block"><a href="http://www.github.com/theamarpatel"><img width="20%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.linkedin.com/in/amarmpatel"><img width="20%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.amarpatel.io/">amarpatel.io</a>',
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

      joe = new Surface({
          content: '<br/><h2>Joe Dou</h2><center><img width="85%" src="content/images/joe.png"/></center><span display="inline-block"><a href="http://www.github.com/joedou"><img width="20%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.linkedin.com/in/joedou"><img width="20%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.whatwouldjoedou.com/">whatwouldjoedou.com</a>',
          size: [undefined, undefined],
          properties: {
            backgroundColor: 'white',
            color: "#404040",
            lineHeight: '50px',
            textAlign: 'center',
            fontFamily: "HelveticaNeue-Light"
          }
      });
    } else {

      amar = new Surface({
        content: '<br/><h2>Amar Patel</h2><center><img width="25%" src="content/images/amar.png"/></center><br/><br/><br/><span display="inline-block"><a href="http://www.github.com/theamarpatel"><img width="6%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.linkedin.com/in/amarmpatel"><img width="5%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.amarpatel.io/">amarpatel.io</a>',
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

      joe = new Surface({
        content: '<br/><h2>Joe Dou</h2><center><img width="25%" src="content/images/joe.png"/></center><br/><br/><br/><span display="inline-block"><a href="http://www.github.com/joedou"><img width="6%" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"/></a>  <a href="http://www.linkedin.com/in/joedou"><img width="5%" src="http://press.linkedin.com/display-media/206/4"/></a></span><br/><a color="#000" href="http://www.whatwouldjoedou.com/">whatwouldjoedou.com</a>',
        size: [undefined, undefined],
        properties: {
          backgroundColor: 'white',
          color: "#404040",
          lineHeight: '50px',
          textAlign: 'center',
          fontFamily: "HelveticaNeue-Light"
        }
      });

    }




    surfaces.push(amar);
    surfaces.push(joe);


    this.add(grid);
  }

  function _createMenu () {
    var menuButton = new Surface({
      content: 'Back',
      properties: {
        textAlign: 'center',
        fontSize: '.8rem',
        fontFamily: 'HelveticaNeue-Light',
        zIndex: 4,
        lineHeight: '45px'
      }
    });

    var menuButtonMod = new Modifier({
      size: [50, 50],
      align: [1, 0],
      origin: [1, 0]
    });

    this.add(menuButtonMod).add(menuButton);

    menuButton.on('click', function () {
      this._eventOutput.emit('mainMenu');
    }.bind(this));
  }

  module.exports = AboutView;
});
