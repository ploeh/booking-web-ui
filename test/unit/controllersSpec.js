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
    var availabilityGateway;
    var datepickerFunction;
  	beforeEach(inject(function($q) {
        datepickerFunction = $.fn.datepicker;
        availabilityGateway = { getAvailabilityForMonth: jasmine.createSpy('getAvailabilityForMonth').andReturn($q.defer().promise) };
  	}));
  	afterEach(function() {
  	  $.fn.datepicker = datepickerFunction;
  	});

  	it('should invoke the datepicker method', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect($.fn.datepicker).toHaveBeenCalled();
      })
    });

    it('should invoke datepicker with an onSelect function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect($.fn.datepicker.mostRecentCall.args[0].onSelect).toBeDefined();
      })
    });

    it('should have an onSelect function that navigates to correct view', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        spyOn($location, 'path').andCallThrough();
        spyOn(scope, '$apply').andCallThrough();
        var dateText = '2013.09.28';
        
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        $.fn.datepicker.mostRecentCall.args[0].onSelect(dateText);

        expect($location.path).toHaveBeenCalledWith('/book/' + dateText);
        expect(scope.$apply).toHaveBeenCalled();
      })
    });

    it('should initially have no days enabled for the month', function() {
      inject(function($location) {
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect(scope.enabledDays).toEqual([]);
      })
    })

    it('should invoke datepicker with a beforeShowDay function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();

        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });

        expect($.fn.datepicker.mostRecentCall.args[0].beforeShowDay).toBeDefined();
        expect($.fn.datepicker.mostRecentCall.args[0].beforeShowDay instanceof Function).toBeTruthy();
      })
    })

    it('should have the correct beforeShowDay function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect($.fn.datepicker.mostRecentCall.args[0].beforeShowDay).toBe(scope.getStatusForDay);
      })
    })

    describe('getStatusForDay', function() {
      it('should return false when no days are enabled', function() {
        inject(function($location) {
          createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
          var actual = scope.getStatusForDay(new Date());
          expect(actual).toEqual([false]);
        })
      })

      it('should return true when the day is enabled', function() {
        inject(function($location) {
          createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
          scope.enabledDays = ['2013.09.26'];

          var actual = scope.getStatusForDay(new Date(2013, 8, 26));

          expect(actual).toEqual([true]);
        })
      })

      it('should return true when the day is one of the enabled days', function() {
        inject(function($location) {
          createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
          scope.enabledDays = ['2013.09.22', '2013.09.24'];

          var actual = scope.getStatusForDay(new Date(2013, 8, 24));

          expect(actual).toEqual([true]);
        })
      })
    })

    it('should invoke datepicker with a onChangeMonthYear function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();

        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });

        expect($.fn.datepicker.mostRecentCall.args[0].onChangeMonthYear).toBeDefined();
        expect($.fn.datepicker.mostRecentCall.args[0].onChangeMonthYear instanceof Function).toBeTruthy();        
      })
    })

    it('should have the correct onChangeMonthYear function', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect($.fn.datepicker.mostRecentCall.args[0].onChangeMonthYear).toBe(scope.changeMonthYear)
      })
    })

    describe('changeMonthYear', function() {
      it('should correctly assign populated enabledDays', inject(function($location, $q, $rootScope) {
        var deferred = $q.defer();
        var stub = { getAvailabilityForMonth: jasmine.createSpy('getAvailabilityForMonth').andReturn(deferred.promise) };
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : stub });

        scope.changeMonthYear(2013, 8);
        deferred.resolve([ { date: '2013.09.26', seats: 1 }, { date: '2013.09.27', seats: 2 } ]);
        $rootScope.$apply();

        expect(scope.enabledDays).toEqual([ '2013.09.26', '2013.09.27' ]);
      }))

      it('should only assign available days to enabledDays', inject(function($location, $q, $rootScope) {
        var deferred = $q.defer();
        var stub = { getAvailabilityForMonth: jasmine.createSpy('getAvailabilityForMonth').andReturn(deferred.promise) };
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : stub });

        scope.changeMonthYear(2013, 7);
        deferred.resolve([ { date: '2013.08.01', seats: 1 }, { date: '2013.08.02', seats: 0 }, { date: '2013.08.03', seats: 4 } ]);
        $rootScope.$apply();

        expect(scope.enabledDays).toEqual([ '2013.08.01', '2013.08.03' ]);
      }))

      it('should refresh datepicker upon success', inject(function($location, $q, $rootScope) {
        spyOn($.fn, 'datepicker').andCallThrough();
        var deferred = $q.defer();
        var stub = { getAvailabilityForMonth: jasmine.createSpy('getAvailabilityForMonth').andReturn(deferred.promise) };
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : stub });

        scope.changeMonthYear(2013, 6);
        deferred.resolve([]);
        $rootScope.$apply();

        expect($.fn.datepicker).toHaveBeenCalledWith('refresh');
      }))
    })

    it('should assign populated days upon initialization', inject(function($location, $q, $rootScope) {
      var deferred = $q.defer();
      var stub = { getAvailabilityForMonth: jasmine.createSpy('getAvailabilityForMonth').andReturn(deferred.promise) };
      
      createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : stub });
      deferred.resolve([ { date: '2013.08.01', seats: 1 }, { date: '2013.08.02', seats: 0 }, { date: '2013.08.03', seats: 4 } ]);
      $rootScope.$apply();

      var today = new Date();
      expect(stub.getAvailabilityForMonth).toHaveBeenCalledWith(today.getFullYear(), today.getMonth() + 1);
      expect(scope.enabledDays).toEqual([ '2013.08.01', '2013.08.03' ]);
    }))

    it('should invoke datepicker with the correct date format', function() {
      inject(function($location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
        expect($.fn.datepicker.mostRecentCall.args[0].dateFormat).toEqual('yy.mm.dd');
      })
    });
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
