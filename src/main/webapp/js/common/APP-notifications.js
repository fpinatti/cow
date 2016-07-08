/**
 * @module APP
 * @namespace APP.notifications
 * @class notifications
 */
/*exported APP */
var APP = window.APP || {};
APP = (function() {
  'use strict';
  var app = window.APP;
  var $ = window.jQuery;

  var module = $.extend(app, {
    // Public properties and methods
    'notifications': {
      'WINDOW_RESIZE': 'app/WINDOW_RESIZE',
      'WINDOW_LOADED': 'app/WINDOW_LOADED',
      // APPLICATION
      'INITIALIZATION_SUCCESS': 'app/INITIALIZATION_SUCCESS',
      'GETPROPERTY': 'property/get',
      'ONGETPROPERTYSUCCESS': 'property/success',
      'ONGETPROPERTYERROR': 'property/error',
      'PAGELOADSTART': 'page/load/start',
      'PAGELOADCOMPLETE': 'page/load/complete',
      'VALIDATION_ERROR': 'form/validation_error'
    }
  });

  return module;
}());
