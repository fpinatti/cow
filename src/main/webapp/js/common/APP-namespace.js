/**
 * Environment configuration properties.
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
  var $ = window.jQuery;

  // Public PROPERTIES and METHODS
  var module = $.extend(app, {});
  // Private VARIABLES

  module.namespace = function(strNamespace) {
    var parts = strNamespace.split('.');
    var parent = APP;
    var i;
    var len;

    if (parts[0] === module.NAME) {
      parts = parts.slice(1);
    }

    len = parts.length;
    for (i = 0; i < len; i += 1) {
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }

      parent = parent[parts[i]];
    }

    return parent;
  };

  return module;
}());
