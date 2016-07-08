/**
 * Twitter widgets.
 *
 * @method modules.Twitter.Widgets
 * @namespace modules.Twitter.Widgets
 * @class modules.Twitter.Widgets
 * @extends modules.Twitter.Widgets
 *
 * @return {self}
 **/
/* exported APP */
var APP = window.APP || {};
APP.namespace('modules.Twitter.Widgets');
APP.modules.Twitter.Widgets = (function() {
  'use strict';

  // Generic variables and module dependencies
  var app = window.APP;

  // Public PROPERTIES and METHODS
  var module = $.extend(app.modules.Twitter.Widgets, {});

  var LIKE_BOX = '<a href="https://twitter.com/share" class="twitter-share-button" data-lang="pt" ' +
    'data-related="CocaCola_Br" data-text="{text}">Tweetar</a>' +
    '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)' +
    '?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=' +
    'p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}' +
    '(document, "script", "twitter-wjs");</script>';

  /**
   * Add a Twitter like box widget into dom element.
   *
   * @method module.likeBox
   * @public
   *
   * @param {!jQuery DOM} $container
   * @param {!String} text
   *
   * @return {Void}
   **/
  module.likeBox = function($container, text) {
    if (!$container || !$container[0]) {
      throw 'Error::Missing required parameter container or not found';
    }
    if (!text) {
      throw 'Error::Missing required parameter @text';
    }

    $container.html(LIKE_BOX.format(encodeURIComponent(text)));
  };

  return module;
}());
