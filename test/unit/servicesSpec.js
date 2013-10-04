'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('bookingApp.services'));

  describe('reservationGateway', function() {
  	var sut;
  	beforeEach(inject(function(reservationGateway) {
  	  sut = reservationGateway;
  	}));

  	describe('make reservation', function() {
  	  it('exists as a property', function(){
  	  	expect(sut.makeReservation).toBeDefined();
  	  });

  	  it('is a function', function() {
  	  	expect(sut.makeReservation instanceof Function).toBeTruthy();
  	  });

  	  it('POSTs correctly', inject(function($httpBackend) {
  	  	var reservationRequest = {
  	  	  date: '2013-09-25',
  	  	  name: 'Mark Seemann',
  	  	  email: 'mark@ploeh.dk',
  	  	  quantity: 4
  	  	};
        $httpBackend.
          expectPOST('reservations', reservationRequest).
          respond(202, { links: [ { rel: 'http://ploeh.samples/notification', href: 'bar' } ] });

  	  	sut.makeReservation(reservationRequest);

  	  	$httpBackend.flush();
  	  }));

  	  it('returns correct result', inject(function($httpBackend) {
  	  	var reservationRequest = {
  	  	  date: '2013-09-26',
  	  	  name: 'Jarl Seemann',
  	  	  email: 'jarl@ploeh.dk',
  	  	  quantity: 1
  	  	};
        var expected = 'notifications/D18E69CF9B3F46D096AAB9E26F91335B'
  	  	$httpBackend.
          expectPOST('reservations', reservationRequest).
          respond(202, { links: [ { rel: 'http://ploeh.samples/notification', href: expected } ] });

  	  	var actual;
  	  	sut.makeReservation(reservationRequest).then(function(data, status) {
  	  	  actual = data;
    		});
    		$httpBackend.flush();

    		expect(actual).toEqual(expected);
  	  }));
  	})
  })

	describe('availabilityGateway', function() {
    var sut;
    beforeEach(inject(function(availabilityGateway) {
      sut = availabilityGateway;
    }))

    describe('get availability for month', function() {
      it('exists as a property', function() {
        expect(sut.getAvailabilityForMonth).toBeDefined();
      })

      it('is a function', function() {
        expect(sut.getAvailabilityForMonth instanceof Function).toBeTruthy();
      })

      it('returns correct result', inject(function($httpBackend) {
        var expected = [ { date: '2013.09.01', seats: 0 }, { date: '2013.09.02', seats: 1}, { date: '2013.09.03', seats: 2 } ];
        $httpBackend.expectGET('availability/2013/9').respond({ openings: expected });

        var actual;
        sut.getAvailabilityForMonth(2013, 9).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).toEqual(expected);
      }))

      it('does not return anything upon HTTP error', inject(function($httpBackend) {
        $httpBackend.expectGET('availability/2014/10').respond(500);

        var actual;
        sut.getAvailabilityForMonth(2014, 10).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).not.toBeDefined();
      }))

      it('rejects on HTTP error', inject(function($httpBackend) {
        $httpBackend.expectGET('availability/2012/1').respond(500);

        var actual;
        sut.getAvailabilityForMonth(2012, 1).then(
          function(data) {},
          function() { actual = true; });
        $httpBackend.flush();

        expect(actual).toBeTruthy();
      }))
    })

    describe('get availability for a day', function() {
      it('exists as a property', function() {
        expect(sut.getAvailabilityForDay).toBeDefined();
      })

      it('is a function', function() {
        expect(sut.getAvailabilityForDay instanceof Function).toBeTruthy();
      })

      it('returns correct result', inject(function($httpBackend) {
        var expected = { date: '2013.04.24', seats: 8 };
        $httpBackend.expectGET('availability/2013/4/24').respond({ openings: [ expected ] });

        var actual;
        sut.getAvailabilityForDay(2013, 4, 24).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).toEqual(expected);
      }))

      it('rejects on HTTP error', inject(function($httpBackend) {
        $httpBackend.expectGET('availability/2012/3/11').respond(500);

        var actual;
        sut.getAvailabilityForDay(2012, 3, 11).then(
          function(data) {},
          function() { actual = true; });
        $httpBackend.flush();

        expect(actual).toBeTruthy();
      }))
    })    
  })

  describe('NotificationGateway', function() {
    var sut;
    beforeEach(inject(function(notificationGateway) {
      sut = notificationGateway;
    }))

    describe('get notification for an ID', function() {
      it('exists as a property', function() {
        expect(sut.getNotification).toBeDefined();
      })

      it('is a function', function() {
        expect(sut.getNotification instanceof Function).toBeTruthy();
      })

      it('returns correct result when there are no notifications on back-end', inject(function($httpBackend) {
        var url = 'notifications/5BD3E3C8FC5E4FC4A54C11283C4531BF';
        $httpBackend.expectGET(url).respond({ notifications: [] });

        var actual;
        sut.getNotification(url).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).toEqual({ notifications: [], url: url });
      }))

      it('returns correct result when there is a single notification on back-end', inject(function($httpBackend) {
        var url = 'notifications/6899E4C6A28E4B3A8C10E56D00155C4F';
        var expected = [ { about: '6899E4C6A28E4B3A8C10E56D00155C4F', type: 'success', message: 'foo' } ];
        $httpBackend.expectGET(url).respond({ notifications: expected });

        var actual;
        sut.getNotification(url).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).toEqual({ notifications: expected, url: url });
      }))

      it('returns only the first notification from the back-end', inject(function($httpBackend) {
        var url = 'notifications/B18D41E607F948E4A661ABA2F7EC1EFF';
        var expected = { about: 'B18D41E607F948E4A661ABA2F7EC1EFF', type: 'error', message: 'bar' };
        $httpBackend.expectGET(url).respond({ notifications: [ expected, { about: '8484AE26294C4115BA738E388ECA885D', type: 'success', message: 'baz' } ] });

        var actual;
        sut.getNotification(url).then(function(data) {
          actual = data;
        })
        $httpBackend.flush();

        expect(actual).toEqual({ notifications: [expected], url: url });
      }))

      it('rejects on HTTP error', inject(function($httpBackend) {
        var url = 'notifications/3D10A94E5D5043318AEC205900B10CFA';
        $httpBackend.expectGET(url).respond(500);

        var actual;
        sut.getNotification(url).then(
          function(data) {},
          function() { actual = true; });
        $httpBackend.flush();

        expect(actual).toBeTruthy();
      }))
    })
  })
});
