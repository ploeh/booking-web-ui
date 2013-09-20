'use strict';

/* Controllers */

angular.module('bookingApp.controllers', []).
  
  controller('MenuController', function($scope, $location, $filter) {
  	$scope.bookToday = function(){
  	  var dateText = $filter('date')(new Date(), 'yyyy.MM.dd');
  	  $location.path('/book/' + dateText);
  	};
  }).

  controller('HomeController', [function() {

  }]).

  controller('BookController', function($scope, $routeParams) {
  	$scope.booking = { date : $routeParams.dateText };

  	$scope.save = function(){
  	  $scope.isReceipt = true;
  	}
  });