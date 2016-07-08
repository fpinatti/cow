/**
 * @module UTILS.Number
 * @namespace UTILS.Number
 * @class UTILS.Number
 */
var UTILS = window.UTILS || {};
UTILS.NumberUtils = (function() {
  'use strict';

  // Public PROPERTIES and METHODS
  var module = {
    'NAME': 'UTILS.NumberUtils'
  };

  // Private VARIABLES

  /**
   * Return number with leading zeros
   * @method module.NumberFormat
   * @public
   *
   * @param str {Number} {Required} Number to be formatted.
   * @param len {String} {Optional} Size of zeros to be added
   *
   * @return {String}
   **/
  module.leadZero = function(str, len) {
    if (!len) {
      len = 2;
    }

    str = str.toString();
    return str.length < len ? module.leadZero('0' + str, len) : str;
  };

  module.validateCPF = function(cpf) {
    var sum = 0;
    var rest;
    var i;

    if (cpf === '00000000000') {
      return false;
    }

    for (i = 1; i <= 9; i = i + 1) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    rest = (sum * 10) % 11;

    if ((rest === 10) || (rest === 11)) {
      rest = 0;
    }
    if (rest !== parseInt(cpf.substring(9, 10))) {
      return false;
    }
    sum = 0;

    for (i = 1; i <= 10; i = i + 1) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    rest = (sum * 10) % 11;

    if ((rest === 10) || (rest === 11)) {
      rest = 0;
    }

    if (rest !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;

  };

  return module;
}());
