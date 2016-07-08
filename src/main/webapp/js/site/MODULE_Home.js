/**
 * @module APP
 * @namespace APP.modules
 * @class Home
 **/
 /*exported APP */
var APP = window.APP || {};
APP.namespace('modules.Home');
APP.modules.Home = (function() {
  'use strict';
  var app = window.APP;

  var module = $.extend(app.modules.Home, {
    'NAME': 'APP.modules.Home'
  });

  /**
   * Module initializator (Constructor)
   * @method module.init
   * @constructor
   * @public
   *
   * @return {Void}
   **/
  module.init = function() {

    cacheDomElements();
    eventListeners(true);
  };

  /**
   * Pattern used to cache DOM elements only once (#perfmatters).
   * @method cacheDomElements
   * @private
   * @return {Void}
   *
   * @sample _$myButtonLink = $('#myButtonLink');
   **/
  function cacheDomElements() {
    //_$btnSeeMore = '.btnSeeMore';
  }

  /**
   * Pattern used to turn on/off event listeners.
   * @method eventListeners
   * @param value {Boolean} Enable or disable event listeners.
   * @private
   * @return {Void}
   *
   * @sample $('#myButton')[func]('vclick', onByButtonCLickHandler);
   **/
  function eventListeners(value) {
    var func = value ? 'on' : 'off';
    if (value) {
      eventListeners(false);
    }

    //_$containerLoadCards[func]('vclick', onByButtonSeeMoreHandler);
    return func;
  }


  return module;

}());
