'use strict';

/* Controllers */

angular.module('bookingApp.controllers', []).
  controller('HomeController', [function() {

  }])
  .controller('BookController', function($scope, $routeParams) {
  	$scope.booking = { date : $routeParams.dateText };
  });