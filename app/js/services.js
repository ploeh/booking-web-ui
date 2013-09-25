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
  });
