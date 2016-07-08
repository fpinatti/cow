/**
 * Facebook widgets.
 *
 * @method modules.Facebook.Widgets
 * @namespace modules.Facebook.Widgets
 * @class modules.Facebook.Widgets
 * @extends modules.Facebook.Widgets
 *
 * @return {self}
 **/
/* exported APP */
var APP = window.APP || {};
APP.namespace('modules.Facebook.Widgets');
APP.modules.Facebook.Widgets = (function() {
  'use strict';

  // Generic variables and module dependencies
  var app = window.APP;

  // Public PROPERTIES and METHODS
  var module = $.extend(app.modules.Facebook.Widgets, {});

  var LIKE_BOX = '<iframe src="//www.facebook.com/plugins/like.php' +
    '?href={url}' +
    'width&amp;layout=button_count&amp;action=like&amp;show_faces=false' +
    '&amp;share=false&amp;height=21&amp;" ' +
    'scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;width:124px;"' +
    'allowTransparency="true"></iframe>';

  /**
   * Add a Facebook like box widget into dom element.
   *
   * @method module.likeBox
   * @public
   *
   * @param {!jQuery DOM} $container
   * @param {!String} url
   *
   * @return {Void}
   **/
  module.likeBox = function($container, url) {
    if (!$container || !$container[0]) {
      throw 'Error::Missing required parameter container or not found';
    }
    if (!url) {
      throw 'Error::Missing required parameter @url';
    }

    $container.html(LIKE_BOX.format(encodeURIComponent(url)));
  };

  return module;
}());
