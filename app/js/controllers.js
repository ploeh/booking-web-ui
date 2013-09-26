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
    $scope.enabledDays = [];

    $scope.dateFormat = 'yy.mm.dd';

    $scope.getStatusForDay = function(date) {
      var formattedDate = $.datepicker.formatDate($scope.dateFormat, date);
      if ($.inArray(formattedDate, $scope.enabledDays) !== -1) {
        return [true];
      }
      return [false];
    };

  	$("#datepicker").datepicker({
  	  dateFormat : $scope.dateFormat,
      beforeShowDay : $scope.getStatusForDay,
  	  onSelect : function(dateText, inst) {
  	  	$location.path('/book/' + dateText);
  	  	$scope.$apply();
  	  }
  	});
  }).

  controller('BookController', function($scope, $routeParams, reservationGateway) {
  	$scope.booking = { date : $routeParams.dateText, quantity : 0 };

  	$scope.seats = [0];

    $scope.isReceipt = false;

  	$scope.save = function() {
      reservationGateway.makeReservation({
        date: $scope.booking.date,
        name: $scope.booking.name,
        email: $scope.booking.email,
        quantity: $scope.booking.quantity
      }).
      success(function() {
        $scope.isReceipt = true;
      });
  	};
  });