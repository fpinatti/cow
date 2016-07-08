/**
 * Main application initializator.
 *
 * @method APP
 * @namespace APP
 * @class APP
 * @extends APP
 *
 * @return {self}
 **/
 /*exported APP */
var APP = window.APP || {};
APP = (function() {
  'use strict';

  // Generic variables and module dependencies
  var app = window.APP;
  //var utils = window.UTILS;
  var $window = $(window);

  // Public PROPERTIES and METHODS
  var module = $.extend(app, {
    'notifications': $.extend(app.notifications, {})
  });

  /**
   * Called as soon as possible when DOM is ready for manipulation (images may not be fully loaded).
   **/
  $(function onDomIsReady() {

    // Init main application (APP)
    app.init();
    PubSub.subscribe(app.notifications.INITIALIZATION_SUCCESS, onInitDone);
  });

  /**
   * Called after all page resources is fully loaded (i.e. images).
   * Secondary items should be loaded here.
   **/
  $window.load(function onWindowHasLoaded() {
    PubSub.publish(app.notifications.WINDOW_LOADED);
    $window.trigger('resize');
  });

  function onInitDone() {
    onAppInitializationSuccess();
    PubSub.unsubscribe(app.notifications.ONGETPROPERTYSUCCESS);
  }
  /**
   * Main application initialization.
   *
   * @method __onAppInitializationSuccess
   * @private
   *
   * @return {Void}
   **/
  function onAppInitializationSuccess() {

    notificationListeners(true);
    // Auto initialize all submodules (APP.modules.*)
    module.initModules(null);

  }

  /**
  * @method getUserBalances
  * @private
  * @param
  * @return {Void}
  **/
  function notificationListeners(value) {
    var func = value ? 'subscribe' : 'unsubscribe';
    if (value) {
      notificationListeners(false);
    }

    PubSub[func](app.notifications.WINDOW_RESIZE, onResizeHandler);
  }

  /**
  * @method onResizeHandler
  * @private
  * @return {Void}
  **/
  function onResizeHandler() {

  }

  return module;
}());
