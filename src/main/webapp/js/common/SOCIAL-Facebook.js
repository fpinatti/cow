/**
 * Facebook API integration.
 *
 * @method modules.Facebook
 * @namespace modules.Facebook
 * @class modules.Facebook
 * @extends modules.Facebook
 *
 * @return {self}
 **/
/* exported APP */
var APP = window.APP || {};
APP.namespace('modules.Facebook');
APP.modules.Facebook = (function() {
  'use strict';

  // Generic variables and module dependencies
  var app = window.APP;

  // Public PROPERTIES and METHODS
  var module = $.extend(app.modules.Facebook, {
    'NAME': 'APP.modules.Facebook',

    'notifications': {
      'API_READY': 'facebook/API_READY',
      'RESPONSE_STATUS': 'facebook/response/status',
      'LOGGED_CHANGE': 'facebook/user/logged/changed',
      'NOT_LOGGED': 'facebook/user/not/logged',
      'USER_INFO': 'facebook/user/info',
      'LOGIN_FINISHED': 'facebook/login/finished',
      'PERMISSIONS_OK': 'facebook/permissions/ok',
      'PERMISSIONS_FAIL': 'facebook/permissions/fail',
      'PROFILE_IMAGE': 'facebook/profile/image',
      'PROFILE_INFO': 'facebook/profile'
    }
  });

  // Private VARIABLES
  var isInitialized = false;
  var FB;
  var objUserVO = {};
  var MSG_FB_NOT_READY = 'Error::call init before calling this method.';
  var MSG_INVALID_CBFUNC = 'Error::Required param @cbFunc is invalid.';
  var MSG_INVALID_FB_APPID = 'Warning::Required param @fbAppId is missing.';

  /**
   * Initialize Facebook API.
   * @method module.init
   * @public
   *
   * @param wFocus {Boolean} {Optional} Set to true if wants to auto-check Facebook authentication status
   *                                    when a window.focus event occurs. Default is false.
   * @param cbFunc {Function} {Optional} Callback function to return Facebook response.
   *
   * @return {Void}
   **/
  module.init = function(wFocus, cbFunc) {
    if (cbFunc && !$.isFunction(cbFunc)) {
      throw MSG_INVALID_CBFUNC;
    }

    // Prevent multiple initializations (optional)
    if (module.getIsInitialized()) {
      return;
    }
    facebookInit(app.getFbAppId(), wFocus, cbFunc);
  };

  function facebookInit(fbAppId, wFocus, cbFunc) {
    if (!fbAppId) {
      console.warn(MSG_INVALID_FB_APPID);
      return;
    }

    if (isInitialized) {
      PubSub.publish(module.notifications.API_READY);
      if ($.isFunction(cbFunc)) {
        cbFunc();
      }
      return;
    }

    if (!$('#fb-root')[0]) {
      $('body').prepend('<div id="fb-root"></div>');
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        'appId': fbAppId,
        'xfbml': true,
        'version': 'v2.3'
      });

      FB = window.FB;

      if (wFocus) {
        $(window).focus(module.getLoginStatus);
      }

      isInitialized = true;

      PubSub.publish(module.notifications.API_READY);
      if ($.isFunction(cbFunc)) {
        cbFunc();
      }
    };

    (function(d, s, id) {
      var js;
      var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/pt_BR/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  function updateStatus(response) {
    var loggedUserVO = {};

    if (response) {
      PubSub.publish(module.notifications.RESPONSE_STATUS, response.status);

      if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        if (response.authResponse) {
          loggedUserVO = {
            'userID': response.authResponse.userID.toString(),
            'accessToken': response.authResponse.accessToken.toString()
          };
        }
      }
      loggedUserVO.status = response.status;
    }

    // Check for status change.
    // * 1. FB logged user has changed
    // * 2. FB logged user has logged out
    if (objUserVO.userID) {
      if (loggedUserVO.userID) {
        if (objUserVO.userID !== loggedUserVO.userID) {
          // FB USER IS LOGGED, BUT HAS CHANGED
          objUserVO = loggedUserVO;
          PubSub.publish(module.notifications.LOGGED_CHANGE, loggedUserVO);
        }
      } else {
        // FB USER IS NOT LOGGED
        objUserVO = loggedUserVO;
        PubSub.publish(module.notifications.NOT_LOGGED, loggedUserVO);
      }
    }

    objUserVO = loggedUserVO;
    PubSub.publish(module.notifications.USER_INFO, objUserVO);
  }

  /**
   * Check Facebook authentication status by API FB.getLoginStatus.
   * @method module.getLoginStatus
   * @public
   *
   * @param cbFunc {Function} {Optional} Callback function to return Facebook response.
   *
   * @return {Void}
   **/
  module.getLoginStatus = function(cbFunc) {
    if (!getIsFbReady()) {
      throw MSG_FB_NOT_READY;
    }
    if (cbFunc && !$.isFunction(cbFunc)) {
      throw MSG_INVALID_CBFUNC;
    }

    window.FB.getLoginStatus(function(response) {
      updateStatus(response);

      if (cbFunc) {
        cbFunc(response);
      }
    }, {
      'force': 'true'
    });
  };
  module.getObjUserVO = function() {
    return objUserVO;
  };

  /**
   * Call Facebook API FB.login.
   * @method module.login
   * @public
   *
   * @param arrScopes {Array} {Optional} Array with needed Facebook autorization scopes. Default is [].
   * @param cbFunc {Function} {Optional} Callback function to return Facebook response.
   *
   * @return {Void}
   **/
  module.login = function(arrScopes, cbFunc) {
    if (!getIsFbReady()) {
      throw MSG_FB_NOT_READY;
    }
    if (!arrScopes) {
      arrScopes = app.getFbScopes();
    }
    if (cbFunc && !$.isFunction(cbFunc)) {
      throw MSG_INVALID_CBFUNC;
    }

    window.FB.login(function(objResponseJSON) {
      updateStatus(objResponseJSON);

      if (cbFunc) {
        cbFunc(objResponseJSON);
      }
    }, {
      'scope': arrScopes.toString()
    });
  };

  /**
   * Gets Facebook logged user public information.
   * Ref: https://developers.facebook.com/docs/graph-api/reference/v2.2/user
   * @method module.getUserProfileInfo
   * @public
   *
   * @param cbFunc {Function} {Optional} Callback function to return Facebook response.
   *
   * @return {Void}
   **/
  module.getUserProfileInfo = function(cbFunc) {
    if (!getIsFbReady()) {
      throw MSG_FB_NOT_READY;
    }
    if (cbFunc && !$.isFunction(cbFunc)) {
      throw MSG_INVALID_CBFUNC;
    }

    window.FB.api('/me',
      function(objResponseJSON) {
        if (cbFunc) {
          cbFunc(objResponseJSON);
        }
        PubSub.publish(module.notifications.PROFILE_INFO, objResponseJSON);
      }
    );
  };

  /**
   * Gets Facebook logged user profile picture.
   * Ref: https://developers.facebook.com/docs/graph-api/reference/v2.2/user/picture
   * @method module.getImageProfile
   * @public
   *
   * @param objImage {Object} {Optional} Custom Facebook parameters.
   * @param cbFunc {Function} {Optional} Callback function to return Facebook response.
   *
   * @return {Void}
   **/
  module.getImageProfile = function(objImage, cbFunc) {
    if (!getIsFbReady()) {
      throw MSG_FB_NOT_READY;
    }

    if (!objImage) {
      objImage = {};
    }
    if (cbFunc && !$.isFunction(cbFunc)) {
      throw MSG_INVALID_CBFUNC;
    }

    var configImage = $.extend({}, {
      'redirect': false,
      'type': 'large'
    }, objImage);

    window.FB.api('/me/picture', configImage,
      function(objResponseJSON) {
        if (cbFunc) {
          cbFunc(objResponseJSON);
        }
        PubSub.publish(module.notifications.PROFILE_IMAGE, objResponseJSON);
      }
    );
  };

  /**
   * Get module initialization status.
   * @method module.getIsInitialized
   * @public
   *
   * @return {Boolean}
   **/
  module.getIsInitialized = function() {
    return isInitialized;
  };

  function getIsFbReady() {
    return (FB && window.FB === FB);
  }

  return module;
}());
