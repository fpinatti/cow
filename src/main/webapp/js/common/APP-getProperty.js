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
  var utils = window.UTILS;
  var $ = window.jQuery;

  // Public PROPERTIES and METHODS
  var module = $.extend(app, {});
  // Private VARIABLES
  var PATH_SERVICE = 'properties.json';
  //var _generalServicePath = 'service/';
  //var _adminServicePath = 'ssldocs/admin/';
  // window.properties is auto populated by "process.env" node variables (replace grunt task)
  var objProperties = {};

  /**
   * Returns environment properties.
   *
   * @method module.getProperty
   * @public
   *
   * @param {?String} urlCustom Custom service path.
   *
   * @return {$.Deferred}
   **/
  module.getProperty = function(urlCustom) {

    //objProperties = {};
    // Prevent multiple calls to getProperty (load only once)
    //console.log('>>>', module.getHttpBaseUrl());
    if (module.getHttpBaseUrl() || module.getHttpsBaseUrl()) {
      return null;
    } else {
      var url = urlCustom || PATH_SERVICE;
      return utils.Ajax.get(url, {
        'cache': true,
        'complete': onGetPropertySuccess
      });
    }
  };

  function onGetPropertySuccess(data) {
    //console.log('**', data);
    var objData = data.responseJSON || {};
    // Populate properties
    $.each(objData, function(i, objItem) {
      //var arrDomains = i.split(',');
      //$.each(arrDomains, function(idx, domain) {
        //if (domain === window.location.hostname || domain === '*') {
      objProperties[i] = objItem;
        //}
      //});

    });
    //PubSub.subscribe(app.notifications.ONGETPROPERTYSUCCESS, teste);
    PubSub.publish(app.notifications.ONGETPROPERTYSUCCESS, objProperties);
    //$.notify(app.notifications.ONGETPROPERTYSUCCESS, objProperties);
  }


  module.getHttpBaseUrl = function() {
    return module.getDataByKey('static.baseurl');
  };
  module.getHttpsBaseUrl = function() {
    return module.getDataByKey('service.baseurl');
  };
  module.getAdminHttpBaseUrl = function() {
    return module.getDataByKey('admin.static.baseurl');
  };
  module.getAdminHttpsBaseUrl = function() {
    return module.getDataByKey('admin.service.baseurl');
  };

  module.getFbAppId = function() {
    return module.getDataByKey('facebook.appId');
  };
  module.getFbScopes = function() {
    var arrScopes = [];
    try {
      arrScopes = module.getDataByKey('facebook.scopes').split(',');
    } catch (ignore) {
      console.log('GETPROPERTY:: Error getting FB scopes');
    }

    return arrScopes;
  };

  module.getDataByKey = function(value) {
    return (objProperties[value]);
  };
  module.setDataByKey = function(key, value) {
    objProperties[key] = value;
  };

  module.parseBaseUrl = function(path) {
    if (!path) {
      throw module.NAME + '::error::Required param path is missing.';
    }
    return path
        .replace(/{{httpBaseUrl}}/gm, module.getHttpBaseUrl())
        .replace(/{{httpsBaseUrl}}/gm, module.getHttpsBaseUrl())
        .replace(/{{adminHttpBaseUrl}}/gm, module.getAdminHttpBaseUrl())
        .replace(/{{adminHttpsBaseUrl}}/gm, module.getAdminHttpsBaseUrl());
  };

  //function getPropByEnv() {
    //window.location.hostname

  //}

  return module;
}());
