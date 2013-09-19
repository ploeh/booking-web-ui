'use strict';

/* Directives */


angular.module('bookingApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('datepicker', function() {
  	return function(scope, elm, attrs) {
  	  elm.datepicker();
  	}
  });
