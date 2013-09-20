'use strict';


// Declare app level module which depends on filters, and services
angular.module('bookingApp', ['bookingApp.filters', 'bookingApp.services', 'bookingApp.directives', 'bookingApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
    $routeProvider.when('/book/:dateText', {templateUrl: 'partials/book.html', controller: 'BookController'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
