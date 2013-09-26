'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('bookingApp.services'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });

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
  	  	$httpBackend.expectPOST('reservationrequests', reservationRequest).respond(202);

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
  	  	$httpBackend.expectPOST('reservationrequests', reservationRequest).respond(202);

  	  	var actual;
  	  	sut.makeReservation(reservationRequest).success(function(data, status, headers) {
  	  	  actual = status;
    		});
    		$httpBackend.flush();

    		expect(actual).toEqual(202);
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
});
