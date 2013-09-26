'use strict';

/* Controllers */

angular.module('bookingApp.controllers', []).
  
  controller('MenuController', function($scope, $location, $filter) {
  	$scope.bookToday = function(){
  	  var dateText = $filter('date')(new Date(), 'yyyy.MM.dd');
  	  $location.path('/book/' + dateText);
  	};
  }).

  controller('HomeController', function($scope, $location, availabilityGateway) {
    $scope.enabledDays = [];

    $scope.dateFormat = 'yy.mm.dd';

    $scope.getStatusForDay = function(date) {
      var formattedDate = $.datepicker.formatDate($scope.dateFormat, date);
      return [$.inArray(formattedDate, $scope.enabledDays) !== -1];
    };

    $scope.changeMonthYear = function(year, month) {
      availabilityGateway.getAvailabilityForMonth(year, month).
        then(function(data) {
          var days = data.
            filter(function(d) { return d.seats > 0 }).
            map(function(d) { return d.date });
          $scope.enabledDays = days;
        })
    };

  	$("#datepicker").datepicker({
  	  dateFormat : $scope.dateFormat,
      beforeShowDay : $scope.getStatusForDay,
      onChangeMonthYear : $scope.changeMonthYear,
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