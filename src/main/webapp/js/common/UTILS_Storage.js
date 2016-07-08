/**
 * Utility to handle with storage API (localStorage, sessionStorage, cookie)
 *
 * @method UTILS.Storage
 * @namespace UTILS.Storage
 * @class UTILS.Storage
 * @extends UTILS.Storage
 *
 */
var UTILS = window.UTILS || {};
UTILS.Storage = (function() {
  'use strict';

  // Public PROPERTIES and METHODS
  var module = {};

  // Private VARIABLES
  var localStorage = window.localStorage;
  var sessionStorage = window.sessionStorage;
  var cookie = document.cookie;

  /**
   * Save localStorage item with cookie fallback.
   *
   * @param {String} key property name
   * @param {*} value property value
   *
   * @return {localStorage / cookie}
   **/
  module.setLocalItem = function(key, value) {
    if (hasLocalStorageSupport()) {
      localStorage.setItem(key, value);
      return localStorage;
    } else {
      cookie = key + '=' + value + '; path=/';
      return cookie;
    }
  };

  /**
   * Retrieve localStorage item with cookie fallback.
   *
   * @param {String} key property name
   *
   * @return {*}
   **/
  module.getLocalItem = function(key) {
    var retVal;

    if (hasLocalStorageSupport()) {
      retVal = localStorage.getItem(key);
    } else {
      retVal = getCookieProperty(key);
    }

    return retVal;
  };

  /**
   * Delete localStorage item with cookie fallback.
   *
   * @param {String} key property name
   *
   * @return {localStorage / cookie}
   **/
  module.deleteLocalItem = function(key) {
    if (hasLocalStorageSupport()) {
      localStorage.removeItem(key);
      return localStorage;
    } else {
      cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return cookie;
    }
  };

  /**
   * Check if localStorage exists AND is supported
   *
   * @return {Void}
   **/
  function hasLocalStorageSupport() {
    var testKey = 'test';

    try {
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
    } catch (error) {
      return false;
    }

    return true;
  }

  /**
   * Save sessionStorage item with cookie fallback.
   *
   * @param {String} key property name
   * @param {*} value property value
   *
   * @return {sessionStorage / cookie}
   **/
  module.setSessionItem = function(key, value) {
    if (hasSessionStorageSupport()) {
      sessionStorage.setItem(key, value);
      return sessionStorage;
    } else {
      cookie = key + '=' + value + '; path=/';
      return cookie;
    }
  };

  /**
   * Retrieve sessionStorage item with cookie fallback.
   *
   * @param {String} key property name
   *
   * @return {*}
   **/
  module.getSessionItem = function(key) {
    var retVal;

    if (hasSessionStorageSupport()) {
      retVal = sessionStorage.getItem(key);
    } else {
      retVal = getCookieProperty(key);
    }

    return retVal;
  };

  /**
   * Delete sessionStorage item with cookie fallback.
   *
   * @param {String} key property name
   *
   * @return {sessionStorage / cookie}
   **/
  module.deleteSessionItem = function(key) {
    if (hasSessionStorageSupport()) {
      sessionStorage.removeItem(key);
      return sessionStorage;
    } else {
      cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return cookie;
    }
  };

  /**
   * Check if sessionStorage exists AND is supported
   *
   * @return {Void}
   **/
  function hasSessionStorageSupport() {
    var testKey = 'test';

    try {
      sessionStorage.setItem(testKey, '1');
      sessionStorage.removeItem(testKey);
    } catch (error) {
      return false;
    }

    return true;
  }

  function getCookieProperty(cname) {
    var name = cname + '=';
    var ca = cookie.split(';');
    var i;
    var c;

    for (i = 0; i < ca.length; i = i + 1) {
      c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  return module;
}());
