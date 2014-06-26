/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        'famous-polyfills': '../lib/famous-polyfills/index'
        // ,buzz: '../lib/buzz/dist/buzz'
    }
});
require(['main']);
