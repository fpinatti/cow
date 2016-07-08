/**
 * String prototype for easily string replacements.
 *
 * @example
 *  Literal string ->
 *  'Name:{0} - Age:{1}'.format('My name', '18');
 *          // Output: "Name:My name - Age:18"
 *
 *  Object map ->
 *  'Name:{name} - Age:{age}'.format({name:'My name', age:'18'});
 *          // Output: "Name:My name - Age:18"
 *
 * @method {String}.format
 * @prototype
 *
 * @param {*} * Arguments...
 *
 * @return {*}
 **/
if (!String.prototype.format) {
  String.prototype.format = function() {
    'use strict';

    var args = arguments;
    if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
      args = args[0];
    }

    return this.replace(/{([^}]*)}/g, function(match, key) {
      return (typeof args[key] !== 'undefined' ?
        args[key] : match
      );
    });
  };
}
