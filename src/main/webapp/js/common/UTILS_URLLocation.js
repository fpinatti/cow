/**
 * Utility for browser url location handler and parse.
 *
 * @method UTILS.URLLocation
 * @namespace UTILS.URLLocation
 * @class UTILS.URLLocation
 * @extends UTILS.URLLocation
 *
 * @return {Void}
 **/
var UTILS = window.UTILS || {};
UTILS.URLLocation = (function() {
  'use strict';

  // Generic variables and module dependencies
  var utils = window.UTILS;

  // Public PROPERTIES and METHODS
  var module = {};

  // Private VARIABLES

  module.getHash = function() {
    return document.location.hash.substring(1);
  };

  module.getHashByName = function(hashName) {
    var urlHash = module.getHash();
    urlHash = urlHash.split(hashName + '=')[1];

    return urlHash;
  };

  module.getQueryString = function() {
    var vars = [];
    var hash;
    var q = document.URL.split('?')[1];
    var i;
    var key;
    var value;

    if (typeof q !== 'undefined') {
      q = q.split('&');
      for (i = 0; i < q.length; i += 1) {
        hash = q[i].split('=');
        key = hash[0];
        value = hash[1];

        if (value && value.indexOf('#') !== -1) {
          value = value.substr(0, value.indexOf('#'));
        }

        vars.push(value);
        vars[key] = value || '';
      }
    }

    return vars;
  };

  module.getParameterByName = function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  module.shortenURL = function(url, cbFunc) {
    var key = window.APP.getGoogleApiKey();
    var urlApi = 'https://www.googleapis.com/urlshortener/v1/url?key=' + key;

    utils.Ajax.post(urlApi, {
      'data': '{"longUrl": "' + url + '"}',
      'success': function(data) {
        cbFunc(data.id);
      },
      'error': function() {
        cbFunc(url);
      }
    });
  };

  return module;
}());
