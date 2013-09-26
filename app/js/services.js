'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('bookingApp.services', []).
  value('version', '0.1').

  factory('reservationGateway', function($http) {
  	return {
  	  makeReservation : function(reservationRequest){
  	  	return $http.post('reservationrequests', reservationRequest);
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
          error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
  	}
  });
