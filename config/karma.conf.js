module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/js/jquery-1.9.1.js',
      'app/js/jquery.ui.core.min.js',
      'app/js/jquery.ui.widget.min.js',
      'app/js/jquery.ui.datepicker.min.js',
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
