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
    });

    it('should invoke datepicker with an onSelect function', function() {
      inject(function($compile, $rootScope) {
        spyOn($.fn, 'datepicker').andCallThrough();
        $compile('<div datepicker />')($rootScope);
        expect($.fn.datepicker.mostRecentCall.args[0].onSelect).toBeDefined();
      })
    });

    it('should have an onSelect function that navigates to correct view', function() {
      inject(function($compile, $rootScope, $location) {
        spyOn($.fn, 'datepicker').andCallThrough();
        spyOn($location, 'path').andCallThrough();
        spyOn($rootScope, '$apply').andCallThrough();
        
        $compile('<div datepicker />')($rootScope);
        $.fn.datepicker.mostRecentCall.args[0].onSelect();

        expect($location.path).toHaveBeenCalledWith('/book');
        expect($rootScope.$apply).toHaveBeenCalled();
      })
    });

    it('should invoke datepicker with the correct date format', function() {
      inject(function($compile, $rootScope) {
        spyOn($.fn, 'datepicker').andCallThrough();
        $compile('<div datepicker />')($rootScope);
        expect($.fn.datepicker.mostRecentCall.args[0].dateFormat).toEqual('yy.mm.dd');
      })
    })
  })
});
