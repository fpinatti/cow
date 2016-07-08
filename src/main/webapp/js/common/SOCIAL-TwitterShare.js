/* exported APP */
var APP = window.APP || {};
APP.namespace('modules.Twitter');
APP.modules.Twitter = (function() {
  'use strict';

  var // Default module variables / dependencies
    app = window.APP,
    $ = window.jQuery,

    module = $.extend(app.modules.Twitter, {
      // Public PROPERTIES and METHODS
      'NAME': 'APP.modules.Twitter'
    }),
    PATH_SERVICE = 'http://twitter.com/intent/tweet?url={{url}}&text={{text}}';

  module.share = function(url, text, useRedirect) {
    if (!url) {
      throw new Error('[Twitter error:: Required parameter @url is missing.');
    }

    var urlApi = PATH_SERVICE.replace('{{url}}', encodeURIComponent(url)).replace('{{text}}', (text ? encodeURIComponent(text) : ''));

    if (!useRedirect) {
      window.open(urlApi, '_blank');
      return;
    }

    window.location.href = urlApi;
  };

  return module;
}());
