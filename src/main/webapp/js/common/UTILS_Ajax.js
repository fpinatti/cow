/**
 * Utility for XMLHTTPrequest (jquery ajax).
 *
 * @method UTILS.Ajax
 * @namespace UTILS.Ajax
 * @class UTILS.Ajax
 * @extends UTILS.Ajax
 *
 * @return {Self}
 **/
var UTILS = window.UTILS || {};
UTILS.Ajax = (function() {
    'use strict';

    // Public PROPERTIES and METHODS
    var module = {
        'objAjax': {
            'type': 'GET',
            'dataType': 'json',
            'crossDomain': true,
            'processData': true,
            'cache': false,
            'async': true,
            'xhrFields': {
                'withCredentials': true
            },
            'headers': {
                'accept': 'application/json'
            },
            'scriptCharset': 'utf-8',
            'contentType': 'application/json;charset=UTF-8'
        }
    };

    // Private VARIABLES

    /**
     * Used to request a script with ajax(xhr) via GET method.
     * @method module.get
     * @public
     *
     * @param {String} url Url path of script to load.
     * @param {?Object} objAjaxConfig Custom jQuery ajax parameters to ovewrite default.
     * See (http://api.jquery.com/jQuery.ajax/)
     *
     * @return {Void}
     **/
    module.get = function(url, objAjaxConfig) {
        return load(url, $.extend(objAjaxConfig, {
            'type': 'GET',
            'processData': false
                /*,
                      contentType: null*/
        }));
    };

    /**
     * Used to request a script with ajax(xhr) via POST method.
     * @method module.post
     * @public
     *
     * @param {String} url Url path of script to load.
     * @param {?Object} objAjaxConfig Custom jQuery ajax parameters to ovewrite default.
     * See (http://api.jquery.com/jQuery.ajax/)
     *
     * @return {Void}
     **/
    module.post = function(url, objAjaxConfig) {
        return load(url, $.extend(objAjaxConfig, {
            'type': 'POST'
        }));
    };

    /**
     * Used to request a script with ajax(xhr) via PUT method.
     * @method module.put
     * @public
     *
     * @param {String} url Url path of script to load.
     * @param {?Object} objAjaxConfig Custom jQuery ajax parameters to ovewrite default.
     * See (http://api.jquery.com/jQuery.ajax/)
     *
     * @return {Void}
     **/
    module.put = function(url, objAjaxConfig) {
        return load(url, $.extend(objAjaxConfig, {
            'type': 'PUT'
        }));
    };

    /**
     * Used to request a script with ajax(xhr) via DEL method.
     * @method module.del
     * @public
     *
     * @param {String} url Url path of script to load.
     * @param {?Object} objAjaxConfig Custom jQuery ajax parameters to ovewrite default.
     * See (http://api.jquery.com/jQuery.ajax/)
     *
     * @return {Void}
     **/
    module.delete = function(url, objAjaxConfig) {
        return load(url, $.extend(objAjaxConfig, {
            'type': 'DELETE'
        }));
    };

    function load(url, objAjaxConfig) {
        if (!url) {
            throw 'Required parameter @url is missing.';
        }

        // IE crossdomain:true bug-fix!
        $.support.cors = true;

        objAjaxConfig.url = url;
        return $.ajax($.extend({}, module.objAjax, objAjaxConfig));
    }

    return module;
}());
