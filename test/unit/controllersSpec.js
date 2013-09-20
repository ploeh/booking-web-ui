'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('bookingApp.controllers'));

  describe('BookController', function() {
  	var createController;
  	var scope;
  	beforeEach(inject(function($controller, $rootScope) {
  	  createController = $controller;
  	  scope = $rootScope.$new();
  	}))

  	it('should set the correct booking date', function() {
  	  var dateText = '2013.09.20';
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : dateText }});
  	  expect(scope.booking.date).toEqual(dateText);
  	});

  	it('should set receipt flag to false initially', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }});
  	  expect(scope.isReceipt).toBeFalsy();
  	});

  	it('should set receipt flag to true upon save', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }});
  	  scope.save();
  	  expect(scope.isReceipt).toBeTruthy();
  	})
  })
});
