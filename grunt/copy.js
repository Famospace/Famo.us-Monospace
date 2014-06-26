// Copies remaining files to places other tasks can use
module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= config.app %>',
      dest: '<%= config.dist %>',
      src: [
        '**/**.{ico,png,txt,jpg,svg,wof,ttf}',
        '.htaccess',
        'images/{,*/}*.webp',
        'sounds/{,*/}*.webp',
        'content/**/**.**',   // adds entire content folder
        // '{,*/}*.html',
        'styles/fonts/{,*/}*.*',
        'lib/famous/**/**.css'
        // 'lib/**/*'
      ]
    }]
  }
};
