'use strict';

/* Controllers */

angular.module('bookingApp.controllers', []).
  
  controller('MenuController', function($scope, $location, $filter) {
  	$scope.bookToday = function(){
  	  var dateText = $filter('date')(new Date(), 'yyyy.MM.dd');
  	  $location.path('/book/' + dateText);
  	};
  }).

  controller('HomeController', function($scope, $location) {
  	$("#datepicker").datepicker({
  	  dateFormat : 'yy.mm.dd',
  	  onSelect : function(dateText, inst) {
  	  	$location.path('/book/' + dateText);
  	  	$scope.$apply();
  	  }
  	});
  }).

  controller('BookController', function($scope, $routeParams, reservationGateway) {
  	$scope.booking = { date : $routeParams.dateText, quantity : 0 };

  	$scope.seats = [0];

  	$scope.save = function() {
      reservationGateway.makeReservation({
        date: $scope.booking.date,
        name: $scope.booking.name,
        email: $scope.booking.email,
        quantity: $scope.booking.quantity
      });
  	  $scope.isReceipt = true;
  	};
  });