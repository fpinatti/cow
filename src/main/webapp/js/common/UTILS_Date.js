/**
 * Utility for date formating.
 *
 * @module UTILS
 * @namespace UTILS.Date
 * @class Date
 */
var UTILS = window.UTILS || {};
UTILS.Date = (function() {
  'use strict';

  // Public PROPERTIES and METHODS
  var module = {};

  // Private VARIABLES

  /**
   * Format string date by input / output patterns
   * @method module.strFormat
   * @public
   *
   * @param strDate {String} {Required} Date in string format.
   * @param patternInput {String} {Optional} Input pattern for parse match. Default is 'mmddyyyy'
   * @param patternOutput {String} {Optional} Output pattern for parse match. Default is 'dd/mm/yyyy'
   *
   * @return {String}
   **/
  module.strFormat = function(strDate, patternInput, patternOutput) {
    if (!strDate) {
      throw '[Date error::Required param strDate is missing.';
    }

    if (!patternInput) {
      patternInput = 'mmddyyyy';
    }
    patternInput = patternInput.toString();
    if (!patternOutput) {
      patternOutput = 'dd/mm/yyyy';
    }
    patternOutput = patternOutput.toString();

    var objReplace = {
      'dd': UTILS.NumberUtils.leadZero(strDate.substr(Math.max(patternInput.indexOf('dd'), 0), 2)),
      'mm': UTILS.NumberUtils.leadZero(strDate.substr(Math.max(patternInput.indexOf('mm'), 0), 2)),
      'yyyy': strDate.substr(Math.max(patternInput.indexOf('yyyy'), 0), 4)
    };
    var re = new RegExp(Object.keys(objReplace).join('|'), 'ig');

    return patternOutput.replace(re, function(matched) {
      return objReplace[matched];
    });
  };

  /**
   * Format date by output patterns
   * @method module.format
   * @public
   *
   * @param numDate {Number} Date in string milliseconds format.
   * @param patternOutput {?String} Output pattern for parse match. Default is 'dd/mm/yyyy'
   * @param offset {?Number} UTC timezone value. Default -3 (Brazil)
   *
   * @return {String}
   **/
  module.format = function(numDate, patternOutput, offset) {
    if (!numDate) {
      throw '[Date error::Required param numDate is missing.';
    }

    if (!patternOutput) {
      patternOutput = 'dd/mm/yyyy';
    }
    patternOutput = patternOutput.toString();

    //var date = new Date(Number(numDate)),
    var date = getUTCDate(Number(numDate), offset);
    var objReplace = {
      'dd': UTILS.NumberUtils.leadZero(date.getDate()),
      'mm': UTILS.NumberUtils.leadZero(date.getMonth() + 1),
      'yyyy': date.getFullYear(),
      'HH': UTILS.NumberUtils.leadZero(date.getHours()),
      'MM': UTILS.NumberUtils.leadZero(date.getMinutes()),
      'SS': UTILS.NumberUtils.leadZero(date.getSeconds())
    };
    var re = new RegExp(Object.keys(objReplace).join('|'), 'ig');

    return patternOutput.replace(re, function(matched) {
      return objReplace[matched];
    });
  };

  function getUTCDate(time, offset) {
    // create Date object for current location
    var d = new Date(time);

    if (typeof offset === 'undefined') {
      offset = d.getTimezoneOffset() / 60 * -1;
    } else if (offset === false) {
      return d;
    }

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000 * offset));
    // return time as a date
    return nd;
  }

  return module;
}());
