'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('bookingApp.controllers'));

  var createController;
  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    createController = $controller;
    scope = $rootScope.$new();
  }));

  describe('MenuController', function() {  	

  	it('should navigate to booking on current date upon book today command', inject(function($location, $filter) {
  	  createController('MenuController', { $scope : scope });
  	  spyOn($location, 'path').andCallThrough();
  	  var dateText = $filter('date')(new Date(), 'yyyy.MM.dd');

  	  scope.bookToday();

  	  expect($location.path).toHaveBeenCalledWith('/book/' + dateText);
  	}));
  });

  describe('HomeController', function() {
  	var datepickerFunction;
	beforeEach(function() {
      datepickerFunction = $.fn.datepicker;
	});
	afterEach(function() {
	  $.fn.datepicker = datepickerFunction;
	});

  	it('should invoke the datepicker method', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location });
        expect($.fn.datepicker).toHaveBeenCalled();
      })
    });

    it('should invoke datepicker with an onSelect function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location });
        expect($.fn.datepicker.mostRecentCall.args[0].onSelect).toBeDefined();
      })
    });

    it('should have an onSelect function that navigates to correct view', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        spyOn($location, 'path').andCallThrough();
        spyOn(scope, '$apply').andCallThrough();
        var dateText = '2013.09.28';
        
        createController('HomeController', { $scope : scope, $location : $location });
        $.fn.datepicker.mostRecentCall.args[0].onSelect(dateText);

        expect($location.path).toHaveBeenCalledWith('/book/' + dateText);
        expect(scope.$apply).toHaveBeenCalled();
      })
    });

    it('should initially have no days enabled for the month', function() {
      inject(function($location) {
        createController('HomeController', { $scope : scope, $location : $location });
        expect(scope.enabledDays).toEqual([]);
      })
    })
  });

  it('should invoke datepicker with the correct date format', function() {
	inject(function($location) {
	  spyOn($.fn, 'datepicker').andCallThrough();
	  createController('HomeController', { $scope : scope, $location : $location });
	  expect($.fn.datepicker.mostRecentCall.args[0].dateFormat).toEqual('yy.mm.dd');
	})
  });

  describe('BookController', function() {
    var reservationGateway;
    beforeEach(function() {
      reservationGateway = {
        makeReservation: jasmine.createSpy('makeReservation').andCallFake(function() {
          return {
            success: function() {},
            error: function(){}
          }
        })
      }
    });

  	it('should set the correct booking date', function() {
  	  var dateText = '2013.09.20';
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : dateText }, reservationGateway : reservationGateway });
  	  expect(scope.booking.date).toEqual(dateText);
  	});

  	it('should set receipt flag to false initially', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway });
  	  expect(scope.isReceipt).toBeFalsy();
  	});

  	it('should contain a seats list with at least a zero', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway });
  	  expect(scope.seats).toContain(0);
  	});

  	it('should have a default quantity', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway });
  	  expect(scope.booking.quantity).toEqual(0);
  	});

    it('should make reservation on gateway upon save', function() {
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : reservationGateway });
      scope.booking.name = 'Linea Vega';
      scope.booking.email = 'like.you.would.like.to.know@would.you.com';
      scope.booking.quantity = 2;
      
      scope.save();

      var expected = {
        date: scope.booking.date,
        name: scope.booking.name,
        email: scope.booking.email,
        quantity: scope.booking.quantity
      };
      expect(reservationGateway.makeReservation).toHaveBeenCalledWith(expected);
    });

    it('should not set isReceipt to true upon gateway failure', function() {
      reservationGateway.makeReservation.andCallFake(function() {
        return {
          success: function(cb) {},
          error: function(cb) { cb(); }
        }
      });
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : reservationGateway });
      scope.booking.name = 'Linea Vega';
      scope.booking.email = 'like.you.would.like.to.know@would.you.not.com';
      scope.booking.quantity = 3;
      
      scope.save();

      expect(scope.isReceipt).toBeFalsy();
    });

    it('should not set isReceipt to true upon gateway failure', function() {
      reservationGateway.makeReservation.andCallFake(function() {
        return {
          success: function(cb) { cb(); },
          error: function(cb) {}
        }
      });
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : reservationGateway });
      scope.booking.name = 'Linea Vega';
      scope.booking.email = 'like.you.would.like.to.know@would.you.not.com';
      scope.booking.quantity = 3;
      
      scope.save();

      expect(scope.isReceipt).toBeTruthy();
    });
  })
});
