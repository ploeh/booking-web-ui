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
});
