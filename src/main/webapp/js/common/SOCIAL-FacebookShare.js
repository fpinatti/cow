/* exported APP */
var APP = window.APP || {};
APP.namespace('modules.Facebook');
APP.modules.Facebook = (function() {
  'use strict';
  var app = window.APP;
  var $ = window.jQuery;

  var module = $.extend(app.modules.Facebook, {
    // Public PROPERTIES and METHODS
    'NAME': 'APP.modules.Facebook'
  });
  // Private VARIABLES
  var PATH_FEED = 'https://www.facebook.com/dialog/feed?display=popup&app_id={{app_id}}' +
    '&link={{link}}' +
    '&redirect_uri={{redirectUri}}' +
    '&picture={{picture}}' +
    '&name={{name}}' +
    '&description={{description}}';
  var PATH_SHARER = 'https://www.facebook.com/sharer/sharer.php?u={{link}}';

  module.share = function(objShareVO, useRedirect) {
    if (!objShareVO.link) {
      throw new Error('[Facebook error:: Required parameter @objShareVO.link is missing.');
    }

    var fbAppId = app.getFbAppId();
    var urlApi = ((!objShareVO.picture && !objShareVO.name) ? PATH_SHARER : PATH_FEED)
      .replace('{{app_id}}', fbAppId)
      .replace('{{link}}', encodeURIComponent(objShareVO.link) || '')
      .replace('{{picture}}', objShareVO.picture || '')
      .replace('{{name}}', encodeURIComponent(objShareVO.name) || '')
      .replace('{{description}}', encodeURIComponent(objShareVO.description) || '')
      .replace('{{redirectUri}}', objShareVO.redirectUri || app.getHttpBaseUrl() + 'close.html');

    if (!fbAppId) {
      throw new Error('[Facebook error:: FB app id is undefined.');
    }

    if (!useRedirect) {
      // openPopupWindow(urlApi);
      window.open(urlApi, '_blank');
      return;
    }

    window.location.href = urlApi;
  };

  return module;
}());
