// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = function (config) {
    config.set({
        // Base path, that will be used to resolve files and exclude.
        basePath: '',

        // Testing framework to use.
        frameworks: ['jasmine'],

        // List of files / patterns to load in the browser.
        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/jquery.ui/jquery-1.10.2.js',
            'app/bower_components/jquery.ui/ui/jquery.ui.core.js',
            'app/bower_components/jquery.ui/ui/jquery.ui.widget.js',
            'app/bower_components/jquery.ui/ui/jquery.ui.datepicker.js',
            'app/js/*.js',
            'app/js/**/*.js',
            'test/unit/*.js',
            'test/unit/**/*.js'
        ],

        // List of files / patterns to exclude.
        exclude: [],

        // Web server port.
        port: 8080,

        // Level of logging. Possible values:
        // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // Enable / disable watching file and executing tests whenever any file
        // changes.
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome_incognito'],

        customLaunchers: {
            Chrome_incognito: {
                base: 'Chrome',
                flags: ['--incognito']
            }
        },

        // Continuous Integration mode. If true, it capture browsers, run tests
        // and exit.
        singleRun: false
    });
};