'use strict';

/* Services */

angular.module('bookingApp.services', []).

  factory('reservationGateway', function($http, $q) {
  	return {
  	  makeReservation : function(reservationRequest) {
        var deferred = $q.defer();
  	  	$http.post('reservations', reservationRequest).
          success(function(data) {
            deferred.resolve(data.links[0].href);
          }).
          error(function() {
            deferred.reject();
          });
        return deferred.promise;
  	  }
  	}
  }).

  factory('availabilityGateway', function($http, $q) {
  	return {
  		getAvailabilityForMonth : function(year, month) {
        var deferred = $q.defer();
        $http.get('availability/' + year + '/' + month).
          success(function(data) {
            deferred.resolve(data.openings);
          }).
          error(function() {
            deferred.reject();
          });
        return deferred.promise;
      },
      getAvailabilityForDay : function(year, month, day) {
        var deferred = $q.defer();
        $http.get('availability/' + year + '/' + month + '/' + day).
          success(function(data) {
            deferred.resolve(data.openings[0]);
          }).
          error(function() {
            deferred.reject();
          });
        return deferred.promise;
      }
  	}
  }).

  factory('notificationGateway', function($http, $q) {
    return {
      getNotification : function(url) {
        var deferred = $q.defer();
        $http.get(url).
          success(function(data) {
            if(data.notifications.length == 0)
              deferred.resolve({ notifications: [], url: url });
            else
              deferred.resolve({ notifications: [data.notifications[0]], url: url })
          }).
          error(function() {
            deferred.reject();
          });
        return deferred.promise;
      }
    }
  });
