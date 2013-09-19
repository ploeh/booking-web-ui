'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('bookingApp.directives'));

  var datepickerFunction;
  beforeEach(function() {
    datepickerFunction = $.fn.datepicker;
  })
  afterEach(function() {
    $.fn.datepicker = datepickerFunction;
  })

  describe('app-version', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });

  describe('datepicker', function() {
    it('should invoke the datepicker method', function() {
      inject(function($compile, $rootScope) {
        spyOn($.fn, 'datepicker').andCallThrough();
        var element = $compile('<div datepicker />')($rootScope);
        expect($.fn.datepicker).toHaveBeenCalled();
      })
    })
  })
});
