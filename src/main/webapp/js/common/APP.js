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
 /* exported APP */
var APP = window.APP || {};
APP = (function() {
  'use strict';

  // Generic variables and module dependencies
  var app = window.APP;
  var utils = window.UTILS;
  var $window = $(window);

  // Public PROPERTIES and METHODS
  var module = $.extend(app, {
    'NAME': 'APP',

    // Enable console commands only on devel environments (dev.citko.net:8000, file://, localhost:8000)
    'DEBUG_MODE': new RegExp(/(dev\.[\w]+\.net|(localhost:[\d]{4}))/i).test(window.location.href),
    //DEBUG_MODE: true,

    'PAGE': {
      'NOT_FOUND': '/page-not-found.html',
      'SYSTEM_UNAVAILABLE': '/page-error.html'
    }

    //notifications: $.extend(app.notifications, {
    // Window events

    //})
  });

  // Private VARIABLES
  var XHR_STATUS = {
    'ERROR_404': 404,
    'ERROR_500': 500
  };

  /**
   * Main application initialization. Must be called before anything else!
   *
   * @method module.init
   * @public
   *
   * @return {$.Deferred}
   **/
  module.init = function() {

    setLogger(module.DEBUG_MODE);
    setAjaxErrorHandler();
    eventListeners(true);
    return app.getProperty()
      .then(function() {
        PubSub.publish(app.notifications.INITIALIZATION_SUCCESS);
        //$.notify(module.notifications.INITIALIZATION_SUCCESS);

      });
  };

  module.initModules = function(arrModules, arrPreventModules, cbFunc) {
    var subMod;

    if (!arrModules) {
      arrModules = $.map(module.modules, function(value, index) {
        return index;
      });
    }

    if (arrModules.length) {
      if (arrPreventModules) {
        // Remove these modules from auto-initialization
        arrModules = arrModules.filter(function(mod) {
          return mod.indexOf(arrPreventModules);
        });
      }

      // Initialize all modules
      $.each(arrModules, function(i, item) {
        try {
          subMod = getModule(item, module.modules);
        } catch (err) {
          throw 'Error::Failed to initialize module: "' + item + '" (' + err + ')';
        }

        if ($.isFunction(subMod.init)) {
          subMod.init();
        }
      });
    }

    if ($.isFunction(cbFunc)) {
      cbFunc();
    }
  };

  function getModule(strMod, scope) {
    if (!scope) {
      scope = module.modules;
    }

    var arrMod = strMod.split('.');
    var item = arrMod.shift();
    var subMod = scope[item];

    if (arrMod.length) {
      // Recursive...
      return getModule(arrMod.join('.'), subMod);
    }

    return subMod;
  }

  function eventListeners(value) {
    var func = value ? 'on' : 'off';
    if (value) {
      eventListeners(false);
    }

    $window[func]('resize', $.throttle(1000 / 5, module.throttledResizeHandler));
    $window[func]('orientationchange', $.throttle(1000 / 5, module.throttledResizeHandler));
    $('document')[func]('orientationchange', $.throttle(1000 / 5, module.throttledResizeHandler));

    return value;
  }

  /**
   * Custom logger
   */
  function setLogger(enable) {
    module.DEBUG_MODE = enable;

    try {
      console.log();
    } catch (error) {
      window.console = {
        'log': empty,
        'dir': empty,
        'debug': empty,
        'info': empty,
        'warn': empty
      };
    } finally {
      if (!module.DEBUG_MODE) {
        console.log('COW BOILERPLATE');
        console.log = empty;
        console.dir = empty;
        console.debug = empty;
        console.info = empty;
        console.warn = empty;
      }
    }
  }

  function empty() {
    return false;
  }

  /**
   * Called by window.resize event at each 250ms. Throttle design pattern. (#perfmatters)
   * @method module.throttledResizeHandler
   * @public
   **/
  module.throttledResizeHandler = function() {
    PubSub.publish(app.notifications.WINDOW_RESIZE);
    //$.notify(app.notifications.WINDOW_RESIZE);
  };

  /**
   * Add default error control for Ajax requests due to utils.Ajax
   * @method setAjaxErrorHandler
   * @private
   *
   * @return {Void}
   **/
  function setAjaxErrorHandler() {
    utils.Ajax.objAjax.error = function(xhr) {
      var errorPage;
      switch (xhr.status) {
        case XHR_STATUS.ERROR_404:
          errorPage = module.PAGE.NOT_FOUND;
          break;
        case XHR_STATUS.ERROR_500:
          errorPage = module.PAGE.SYSTEM_UNAVAILABLE;
          break;
        default:
          return true;
      }

      // Enable ajax debug by url query string "&debug=true"
      if (module.DEBUG_MODE && utils.URLLocation.getQueryString().ajaxDebug) {
        console.log('Error::', xhr, xhr.responseText);
        return true;
      } else {
        window.location.href = errorPage;
        return false;
      }
    };
  }

  /**
   * Redirect user to error page due to statusCode
   * @method module.gotoErrorPage
   * @public
   *
   * @param xhr {Object} XMLHttpRequest error object
   *
   * @return {Void}
   **/
  module.gotoErrorPage = function(xhr) {
    if (!xhr) {
      throw 'Error::Required param xhr is missing.';
    } else if (!xhr.status || xhr.status !== XHR_STATUS['ERROR_' + xhr.status]) {
      throw 'Error::Required param xhr has invalid status.';
    }

    utils.Ajax.objAjax.error(xhr);
  };

  return module;
}());
