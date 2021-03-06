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

    it('should invoke datepicker with the correct first day', inject(function($location) {
      spyOn($.fn, 'datepicker').andCallThrough();
      createController('HomeController', { $scope : scope, $location : $location, availabilityGateway : availabilityGateway });
      expect($.fn.datepicker.mostRecentCall.args[0].firstDay).toEqual(1);
    }))
  });

  describe('BookController', function() {
    var availabilityGateway;
    var reservationGateway;
    beforeEach(inject(function($q) {
      availabilityGateway = { getAvailabilityForDay : jasmine.createSpy('getAvailabilityForDay').andReturn($q.defer().promise) };
      reservationGateway = { makeReservation: jasmine.createSpy('makeReservation').andReturn($q.defer().promise) };
    }));

  	it('should set the correct booking date', function() {
  	  var dateText = '2013.09.20';
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : dateText }, reservationGateway : reservationGateway, availabilityGateway : availabilityGateway });
  	  expect(scope.booking.date).toEqual(dateText);
  	});

  	it('should set receipt flag to false initially', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway, availabilityGateway : availabilityGateway });
  	  expect(scope.isReceipt).toBeFalsy();
  	});

  	it('should contain a seats list with at least a zero', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway, availabilityGateway : availabilityGateway });
  	  expect(scope.seats).toContain(0);
  	});

    it('should assign all seats up to maximum supplied by availabilityGateway', inject(function($q, $rootScope) {
      var deferred = $q.defer();
      var stub = { getAvailabilityForDay : jasmine.createSpy('getAvailabilityForDay').andReturn(deferred.promise) };

      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway, availabilityGateway : stub });
      deferred.resolve({ date: '2013.09.20', seats: 10 });
      $rootScope.$apply();
      
      expect(scope.seats).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }))

  	it('should have a default quantity', function() {
  	  createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.20' }, reservationGateway : reservationGateway, availabilityGateway : availabilityGateway });
  	  expect(scope.booking.quantity).toEqual(0);
  	});

    it('should make reservation on gateway upon save', function() {
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : reservationGateway, availabilityGateway : availabilityGateway });
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

    it('should not set isReceipt to true upon gateway failure', inject(function($q, $rootScope) {
      var deferred = $q.defer();
      var stub = { makeReservation: jasmine.createSpy('makeReservation').andReturn(deferred.promise) };
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : stub, availabilityGateway : availabilityGateway });
      scope.booking.name = 'Linea Vega';
      scope.booking.email = 'like.you.would.like.to.know@would.you.not.com';
      scope.booking.quantity = 3;
      
      scope.save();
      deferred.reject();
      $rootScope.$apply();

      expect(scope.isReceipt).toBeFalsy();
    }));

    it('should set isReceipt to true upon gateway success', inject(function($q, $rootScope) {
      var deferred = $q.defer();
      var stub = { makeReservation: jasmine.createSpy('makeReservation').andReturn(deferred.promise) };
      scope.addNotificationAddress = jasmine.createSpy('addNotificationAddress');
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : stub, availabilityGateway : availabilityGateway });
      scope.booking.name = 'Linea Vega';
      scope.booking.email = 'like.you.would.like.to.know@would.you.not.com';
      scope.booking.quantity = 3;
      
      scope.save();
      deferred.resolve();
      $rootScope.$apply();

      expect(scope.isReceipt).toBeTruthy();
    }));

    it('should add notification address upon success', inject(function($q, $rootScope) {
      var deferred = $q.defer();
      var stub = { makeReservation: jasmine.createSpy('makeReservation').andReturn(deferred.promise) };
      scope.addNotificationAddress = jasmine.createSpy('addNotificationAddress');
      createController('BookController', { $scope : scope, $routeParams : { dateText : '2013.09.25' }, reservationGateway : stub, availabilityGateway : availabilityGateway });

      scope.save();
      deferred.resolve('foo');
      $rootScope.$apply();

      expect(scope.addNotificationAddress).toHaveBeenCalledWith('foo');
    }));
  })

  describe('NotificationsController', function() {
    var notificationGateway;
    beforeEach(inject(function($q) {
      notificationGateway = { getNotification : jasmine.createSpy('getNotification').andReturn($q.defer().promise) };
    }));

    describe('add notification poll address', function() {
      it('exists as a property', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.addNotificationAddress).toBeDefined();
      }))

      it('is a function', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.addNotificationAddress instanceof Function).toBeTruthy();
      }))

      it('adds the poll url to the array of poll urls', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        scope.addNotificationAddress('foo');
        expect(scope.pollUrls).toEqual(['foo']);
      }))

      it('adds the poll url to the end of existing poll urls', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        scope.pollUrls = ['bar'];

        scope.addNotificationAddress('baz');

        expect(scope.pollUrls).toEqual(['bar', 'baz']);
      }))
    })

    describe('poll once', function() {
      it('exists as a property', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.pollOnce).toBeDefined();
      }))

      it('is a function', inject(function($q, $rootScope) {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.pollOnce instanceof Function).toBeTruthy();
      }))

      it('adds a notification received from the gateway', inject(function($q, $rootScope) {
        var deferred = $q.defer();
        var stub = { getNotification : jasmine.createSpy('getNotification').andReturn(deferred.promise) };
        createController('NotificationsController', { $scope : scope, notificationGateway : stub });        
        scope.pollUrls = ['notifications/ploeh'];

        scope.pollOnce();
        deferred.resolve({ notifications: [ { about: '1D5DAE201ECE4EBAAF536C75ADF30CC1', type: 'success', message: 'ploeh' } ], url: 'notifications/ploeh' });
        $rootScope.$apply();

        expect(stub.getNotification).toHaveBeenCalledWith('notifications/ploeh');
        expect(scope.notifications).toEqual([ { about: '1D5DAE201ECE4EBAAF536C75ADF30CC1', type: 'success', message: 'ploeh' } ]);
        expect(scope.pollUrls).toEqual([]);
      }))

      it('does not remove poll url when response has no notifications', inject(function($q, $rootScope) {
        var deferred = $q.defer();
        var stub = { getNotification : jasmine.createSpy('getNotification').andReturn(deferred.promise) };
        createController('NotificationsController', { $scope : scope, notificationGateway : stub });        
        scope.pollUrls = ['notifications/ploeh'];

        scope.pollOnce();
        deferred.resolve({ notifications: [], url: 'notifications/ploeh' });
        $rootScope.$apply();

        expect(stub.getNotification).toHaveBeenCalledWith('notifications/ploeh');
        expect(scope.notifications).toEqual([]);
        expect(scope.pollUrls).toEqual(['notifications/ploeh']);
      }))
    })

    describe('dismiss', function() {
      it('exists as a property', inject(function() {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.dismiss).toBeDefined();
      }))

      it('is a function', inject(function() {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        expect(scope.dismiss instanceof Function).toBeTruthy();
      }))

      it('removes the notification when invoked', inject(function() {
        createController('NotificationsController', { $scope : scope, notificationGateway : notificationGateway });
        scope.notifications = [ {about: '532E191BEE4C4FC9A4628FFD70402C01', type: 'success', message: 'fnaah' } ];

        scope.dismiss({about: '532E191BEE4C4FC9A4628FFD70402C01', type: 'success', message: 'fnaah' });

        expect(scope.notifications).toEqual([]);
      }))
    })
  })
});
