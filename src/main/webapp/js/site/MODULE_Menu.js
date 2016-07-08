/**
 * @module APP
 * @namespace APP.modules
 * @class Menu
 **/
 /*exported APP */
var APP = window.APP || {};
APP.namespace('modules.Menu');
APP.modules.Menu = (function(window) {
  'use strict';
  var app = window.APP;

  var module = $.extend(app.modules.Menu, {
    'NAME': 'APP.modules.Menu'
  });

  var btnSandwich;

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
    btnSandwich = $('.icon-sandwich');
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

    btnSandwich[func]('vclick', onClickSandwich);

  }

  function onClickSandwich(evt) {

    evt.preventDefault();
    $('.top--nav').toggleClass('top--nav__opened');

  }


  return module;

}(window));
