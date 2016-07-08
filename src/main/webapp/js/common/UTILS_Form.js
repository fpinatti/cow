/**
 * @module UTILS
 * @namespace UTILS.Form
 * @class Form
 **/
var UTILS = window.UTILS || {};
UTILS.Form = (function() {
  'use strict';

  // Generic variables and module dependencies
  var $ = window.jQuery;
  var app = window.APP;

  // Public PROPERTIES and METHODS
  var module = {
    'DATA_VO': 'objFormConfigVO',

    // FIELD RULES
    'RULE_EMAIL': 'email',
    'RULE_MATCH': 'MATCH',
    'RULE_MATCH_CASEINSENSITIVE': 'MATCH_CASEINSENSITIVE',
    'RULE_NONE_OR_ALL': 'NONE_OR_ALL',
    'RULE_PASSWORDS': 'PASSWORDS',
    'RULE_EQUALS': 'EQUALS',

    // MASK PATTERNS
    'PHONE_PATTERN': '0000-00009',

    // MESSAGRES
    'MSG_ERROR_GENERIC': 'Verifique os campos destacados.'
  };
  // Private VARIABLES
  var PLACEHOLDER_GENERIC_ERROR = '.warning-message';
  var PLACEHOLDER_SOCIAL_ERROR = '.warning-message-social';
  var ERROR_CLASS = '.has-error';
  var $window = $(window);
  var itvFieldToFocus;
  var DISABLED_CLASS = '.is-disabled';

  /**
   * Prepare <form> for post validation.
   *
   * @method module.prepare
   * @public
   *
   * @param objFormConfigVO {Object} {Required} Object with form information.
   *      @$form {jQuery DOM} {Required} DOM <form> element to validate.
   *      @arrFields {Array} Each field to validate. {objFormItemVO}
   *
   *          {Object objFormItemVO} especification:
   *              @field {jQuery DOM} Element to validate.
   *              @required {Boolean} Define if the field is mandatory.
   *              @key {String} Define the "key" parameter that can be used to parse a {key:value} post object format.
   *
   *              @listKey {String} Define the "key" parameter that can be used to parse a
   *                                listKey[listName]:{key:value} post object format.
   *              @listName {String} Define the "name" for listKey array listKey[listName]:{key:value}
   *                                 post object format. (@listKey is needed to activate this option)
   *
   *              @gorupKey {String} Define the "key" parameter that can be used to parse a
   *                                 { groupKey:{ key:value } } post object format.
   *                @concat {Boolean} Set true if @groupKey should be grouped as String instead of Object.
   *                                  Default is false. (@groupKey is needed to activate this option)
   *              @rule {String} Especial rule to validate this field. See available options "RULE_{{type}}" constants.
   *              @fieldMatch {jQuery DOM} Element to validate if rule is RULE_MATCH / RULE_MATCH_CASEINSENSITIVE.
   *
   *      @customFormSubmit {Function} Custom function to use instead of native form submit action.
   *      @$warningMessage : {jQuery DOM} Element where error messages should appear.
   *                                              Default is $form child class '.warning-message'.
   *      @msgGenericError {String} Generic error message
   * @param actionPath {String} {Optional} URL to set form action property.
   *
   * @return UTILS.Form {Self}
   **/
  module.prepare = function(objFormConfigVO, actionPath) {
    if (!objFormConfigVO.$form) {
      throw 'Error::Required param objFormItemVO.$form is missing or not found.';
    } else if (!objFormConfigVO.arrFields || !objFormConfigVO.arrFields.length) {
      throw 'Error::Required param objFormItemVO.arrFields is missing.';
    }

    var $form = objFormConfigVO.$form;
    $form.data(module.DATA_VO, objFormConfigVO);

    prepareFields(objFormConfigVO);

    if (actionPath) {
      $form.prop('action', actionPath);
    }
    // Hijack submit action
    $form.off('submit').on('submit', onFormSubmit);

    return this;
  };

  function prepareFields(objFormConfigVO) {
    var $form = objFormConfigVO.$form;
    var arrFields = objFormConfigVO.arrFields;
    var $field;

    $.each(arrFields, function(i, objFormItemVO) {
      $field = objFormItemVO.field;

      // Auto generate "arrFieldsGroup" property for objFormItemVO
      setArrFieldsGroup(objFormItemVO, arrFields);

      // Set field properties (tabindex, maxlen...)
      setFieldState(objFormItemVO);
      setInitialValue(objFormItemVO);
      setRestrictedChars(objFormItemVO);
      setMask(objFormItemVO);
      setMaxLength(objFormItemVO);
      setCustomType(objFormItemVO);

      $field.prop('tabindex', i + 1);
    });

    $form.attr('method', objFormConfigVO.method || ($form.attr('method') || 'post'))
      .find('[type="submit"]').prop('tabindex', $field.prop('tabindex') + 1);
  }

  function setArrFieldsGroup(objFormItemVO, arrFields) {
    var groupKey = objFormItemVO.groupKey;
    if (!objFormItemVO.groupKey || objFormItemVO.arrFieldsGroup) {
      return;
    }

    objFormItemVO.arrFieldsGroup = $.map(arrFields, function(item) {
      if (item.groupKey === groupKey) {
        return item.field;
      } else {
        //FIXME - adicionado para nao quebrar eslint, verificar se isso nao quebrara nenhuma implementacao
        return '';
      }
    });
  }

  function setFieldState(objFormItemVO) {
    var $field = objFormItemVO.field;
    var disabledClass = DISABLED_CLASS.slice(1);

    if (objFormItemVO.disabled) {
      $field.prop('disabled', objFormItemVO.disabled)
        .addClass(disabledClass)
        .parent().addClass(disabledClass);
    }
  }

  function setInitialValue(objFormItemVO) {
    var $field = objFormItemVO.field;
    if (objFormItemVO.value) {
      $field.val(objFormItemVO.value);
    }
  }

  function setMaxLength(objFormItemVO) {
    if (!objFormItemVO.max && !objFormItemVO.mask) {
      return;
    }

    var $field = objFormItemVO.field;
    $field.attr('maxlength', objFormItemVO.max || objFormItemVO.mask.split('?').join('').length);
    $field.data('placeholder-maxlength', $field.attr('maxlength'));
    $field.data('maxlength', $field.attr('maxlength'));

    // Bug-fix: maxlength attribute does not in IE prior to IE10
    // http://stackoverflow.com/q/4717168/740639
    // Probably caused by placeholder fallback plugin
    $field.on('input keyup', function(evt) {
      var $this = $(this);
      var dataMaxLength = $this.data('maxlength');
      var attrMaxLength = $this.attr('maxlength');
      var maxlength = dataMaxLength || attrMaxLength;
      var text;

      if (attrMaxLength !== maxlength) {
        $this.attr('maxlength', maxlength);
      }

      if (!maxlength) {
        $field.off('input keyup');
        return;
      }

      text = $this.val();
      if (text.length > maxlength) {
        $this.val(text.substring(0, maxlength));
        evt.preventDefault();
      }
    });
  }

  function setRestrictedChars(objFormItemVO) {
    if (objFormItemVO.rule === module.RULE_EMAIL) {
      objFormItemVO.restrictPrevent = ' ';
      objFormItemVO.restrictAllow = '@+.-_';
    }

    if (!objFormItemVO.restrictType &&
      !objFormItemVO.restrictPrevent &&
      !objFormItemVO.restrictAllow) {
      return;
    }

    var $field = objFormItemVO.field;
    var objRestrictConfig = {
      'allow': objFormItemVO.restrictAllow,
      'ichars': objFormItemVO.restrictPrevent
    };

    switch (objFormItemVO.restrictType) {
      case 'numeric':
        $field.numeric(objRestrictConfig);
        break;
      case 'alpha':
        $field.alpha(objRestrictConfig);
        break;
      default:
        $field.alphanumeric(objRestrictConfig);
    }
  }

  function setMask(objFormItemVO) {
    if (!objFormItemVO.mask) {
      return;
    }

    var $field = objFormItemVO.field;
    var mask = objFormItemVO.mask;
    var maskOptions = {
      'clearIfNotMatch': true,
      'placeholder': '',
      'watchInterval': 1000 / 15,
      'reverse': false
    };

    // Add phone extra digit behavior
    if (objFormItemVO.mask === module.PHONE_PATTERN) {
      maskOptions.onKeyPress = function(val, e, $wfield, objOptions) {
        $wfield.mask(maskPhoneExtraDigitControlHandler.apply({}, arguments), objOptions);
      };

      mask = maskPhoneExtraDigitControlHandler;
    }

    $field.mask(mask, $.extend({}, maskOptions, objFormItemVO.maskOptions));
  }

  function maskPhoneExtraDigitControlHandler(val) {
    return val.length === module.PHONE_PATTERN.length ?
      module.PHONE_PATTERN.replace('-0', '0-') :
      module.PHONE_PATTERN;
  }

  function setCustomType(objFormItemVO) {
    var $field = objFormItemVO.field;

    if (objFormItemVO.rule === module.RULE_EMAIL) {
      // Prevent IE9 HTML5 compatibility error
      try {
        $field.prop('type', 'email');
      } catch (ignore) {
        console.log('UTILS-Form:: setCustomType');
      }
    }
  }

  function checkCharIsEquals(objFormItemVO) {
    var $field = objFormItemVO.field;
    var str = $field.val().replace(/[^\w\s]/gi, '');
    var regExp = new RegExp($field.val().split('')[0] + '{' + str.length + '}');
    var isOk = regExp.test(str);

    return !isOk;
  }

  function validateForm(objFormConfigVO) {
    var $form = objFormConfigVO.$form;
    var arrFields = objFormConfigVO.arrFields;
    var isReady = true;

    module.hideWarningMessage($form);
    $.each(arrFields, function(i, objFormItemVO) {
      // Check if filled information is right
      var hasFieldError = !validateField(objFormItemVO);

      module.setFieldError(objFormItemVO.field, hasFieldError);
      if (objFormItemVO.fieldMatch) {
        module.setFieldError(objFormItemVO.fieldMatch, hasFieldError);
      }

      // At least one field is incorrect
      if (isReady && hasFieldError) {
        isReady = false;
      }
    });

    if (!isReady) {
      module.showWarningMessage($form);
    }

    return isReady;
  }

  /**
   * Field validation.
   *
   * @method validateField
   * @private
   *
   * @param {!Object FormItemVO} objFormItemVO
   *
   * @return {Boolean}
   **/
  function validateField(objFormItemVO) {
    var isOk;

    // Required not empty
    isOk = checkRequired(objFormItemVO);

    // Rules validation
    if (isOk) {
      switch (objFormItemVO.rule) {
        case module.RULE_NONE_OR_ALL:
          isOk = checkNoneOrAll(objFormItemVO);
          break;
        case module.RULE_EMAIL:
          isOk = checkEmail(objFormItemVO);
          break;
        case module.RULE_MATCH:
          isOk = checkMatch(objFormItemVO);
          break;
        case module.RULE_MATCH_CASEINSENSITIVE:
          isOk = checkMatch(objFormItemVO, true);
          break;
        case module.RULE_PASSWORDS:
          isOk = checkNoneOrAll(objFormItemVO);
          if (isOk) {
            isOk = checkMatch(objFormItemVO);
          }
          break;
        case module.RULE_EQUALS:
          isOk = checkCharIsEquals(objFormItemVO);
          break;
        default:
      }
    }

    return isOk;
  }
  /**
   * Check if required field is filled correctly.
   *
   * @method checkRequired
   * @private
   *
   * @param {!Object FormItemVO} objFormItemVO
   *
   * @return {Boolean}
   **/
  function checkRequired(objFormItemVO) {
    var $field = objFormItemVO.field;
    var isRequired = objFormItemVO.required === true;
    var isFilled;

    if (!isRequired) {
      return true;
    }

    if (!$field[0]) {
      console.warn('[Form Warn::@field not found', objFormItemVO.field);
      return false;
    }

    switch ($field.prop('type')) {
      case 'checkbox':
        isFilled = $field.prop('checked') === true;
        break;
      case 'radio':
        isFilled = $field.filter(':checked').length;
        break;
      default:
        isFilled = $field.val().length >= (objFormItemVO.min || 1);
    }

    return isFilled;
  }
  /**
   * Check if required field is filled with valid email format.
   *
   * @method checkEmail
   * @private
   *
   * @param {!Object FormItemVO} objFormItemVO
   *
   * @return {Boolean}
   **/
  function checkEmail(objFormItemVO) {
    var $field = objFormItemVO.field;
    var regExp = /^([\w_\.\-\+_])+\@(([\w\-])+\.)+([\w]{2,4})+$/;
    var isOk = regExp.test($field.val());

    return isOk;
  }
  /**
   * Check if some field is filled with the same value as another field.
   *
   * @method checkMatch
   * @private
   *
   * @param {!Object FormItemVO} objFormItemVO
   * @param {?Boolean caseInsensitive} caseInsensitive
   *
   * @return {Boolean}
   **/
  function checkMatch(objFormItemVO, caseInsensitive) {
    var $field = objFormItemVO.field;
    var $fieldMatch = objFormItemVO.fieldMatch;

    var isOk;
    if (caseInsensitive) {
      isOk = ($field.val().toLowerCase() === $fieldMatch.val().toLowerCase());
    } else {
      isOk = ($field.val() === $fieldMatch.val());
    }

    return isOk;
  }

  /**
   * Check if all fields are empty or if any is filled, so all is required.
   *
   * Comon used on new password update registration flow.
   * @method checkNoneOrAll
   * @private
   *
   * @param {!Object FormItemVO} objFormItemVO
   *
   * @return {Boolean}
   **/
  function checkNoneOrAll(objFormItemVO) {
    var arrFieldsGroup = objFormItemVO.arrFieldsGroup;
    var isAllEmpty = '';
    var hasFieldError = false;

    if (!arrFieldsGroup) {
      throw 'Error::@arrFieldsGroup property can only be used within @groupKey property defined objFormItemVO.';
    }

    // Is all fields empty ?
    $.each(arrFieldsGroup, function(i, item) {
      isAllEmpty += item.val();
    });
    if (!isAllEmpty.length) {
      return true;
    }

    // There is any field filled? If there is, all fields are filled with minimun value ?
    $.each(arrFieldsGroup, function(i, item) {
      if (!hasFieldError && item.val().length < objFormItemVO.min) {
        hasFieldError = true;
      }
      module.setFieldError(item, hasFieldError);
    });
    if (hasFieldError) {
      return false;
    }

    // Check if there is MATCH field
    // if(objFormItemVO.fieldMatch) {
    //     return checkMatch(objFormItemVO);
    // }

    return true;
  }

  function onFormSubmit(e) {
    e.preventDefault();

    var $form = $(e.target);
    var objFormConfigVO = $form.data(module.DATA_VO);
    var isFormReady = validateForm(objFormConfigVO);

    if (isFormReady && typeof objFormConfigVO.customFormSubmit === 'function') {
      objFormConfigVO.customFormSubmit(e);
    }

    return isFormReady;
  }

  module.setFocusOn = function($field) {
    $field.trigger('focus').trigger('blur');

    if (itvFieldToFocus) {
      clearTimeout(itvFieldToFocus);
    }
    itvFieldToFocus = setTimeout(function() {
      try {
        $field.trigger('focus');
      } catch (err) {
        console.warn('[Form Warn::$form or $field was not found.');
      }
    }, 100);
  };

  /**
   * Auto parse filled form values.
   *
   * @method module.parseFormData
   * @public
   *
   * @param {!jQuery DOM} $form
   * @param {?Object} objExtraParams Add extra parameters to objSendData object.
   *
   * @return {Object}
   **/
  module.parseFormData = function($form, objExtraParams) {
    var objFormConfigVO = $form.data(module.DATA_VO);
    var objSendData = {};
    var objSendHeaders = null;
    var arrFields = objFormConfigVO.arrFields;

    // Auto parse form data to POST
    $.each(arrFields, function onEachObjFormItemVO(i, objFormItemVO) {
      var key = objFormItemVO.key;
      var gKey = objFormItemVO.groupKey;
      var lKey = objFormItemVO.listKey;
      var hKey = objFormItemVO.headersKey;

      if (hKey) {
        if (!objSendHeaders) {
          objSendHeaders = {};
        }
        objSendHeaders[hKey] = getFieldKeyValue(objFormItemVO);
        return;
      }

      if (gKey) {
        if (objSendData[gKey]) {
          return;
        }
        objSendData[gKey] = getGroupKeyValue(objFormItemVO, arrFields);
      } else if (lKey) {
        if (objSendData[lKey]) {
          return;
        }
        objSendData[lKey] = getListKeyValue(objFormItemVO, arrFields);
      } else if (key) {
        objSendData[key] = getFieldKeyValue(objFormItemVO);
      }
    });

    if (objSendHeaders) {
      return {
        'dataFields': $.extend(objSendData, objExtraParams),
        'headers': objSendHeaders
      };
    } else {
      return $.extend(objSendData, objExtraParams);
    }
  };

  function getFieldKeyValue(objFormItemVO) {
    var $field = objFormItemVO.field;
    var value;

    if (!$field || !$field[0]) {
      throw '[KOID Error::Required param $field is missing or not found.';
    }

    switch ($field.prop('type')) {
      case 'checkbox':
        value = $field.prop('checked');
        break;
      case 'radio':
        value = $field.filter(':checked').val();
        break;
      default:
        // text, password, email...
        value = $.trim($field.val());
    }

    return value;
  }

  function getGroupKeyValue(objFormItemVO, arrFields) {
    var groupKey = objFormItemVO.groupKey;
    var groupValue;

    $.map(arrFields, function(item) {
      if (item.groupKey === groupKey) {
        if (item.concat) {
          if (!groupValue) {
            groupValue = '';
          }
          groupValue += getFieldKeyValue(item);
        } else {
          if (!groupValue) {
            groupValue = {};
          }
          groupValue[item.key] = getFieldKeyValue(item);
        }
      }
    });

    return groupValue;
  }

  function getListKeyValue(objFormItemVO, arrFields) {
    var listKey = objFormItemVO.listKey;
    var listValue = [];
    var listName;

    $.map(arrFields, function(item) {
      if (item.listKey === listKey) {
        if (!item.listName) {
          throw '[KOID Error::@listKey property needs to be used with @listName property.';
        }

        listName = item.listName;
        if (!listValue[listName]) {
          listValue[listName] = {};
        }

        listValue[listName][item.key] = getFieldKeyValue(item);
      }
    });

    return listValue;
  }

  /**
  * Show warning message to user.
  *
  * @method module.showWarningMessage
  * @public
  *
  * @param {!jQuery DOM} $form <form> element to validate.
  * @param {?String} msgErrorCustom
  * @param {?jQuery DOM} $fieldToFocus Field element to focus on error. Default is the first field.
  **/
  module.showWarningMessage = function($form, msgErrorCustom, $fieldToFocus, isSocial) {
    var objFormConfigVO;
    try {
      objFormConfigVO = $form.data(module.DATA_VO);
    } catch (err) {
      return;
    }

    var $warningMessage = objFormConfigVO.$warningMessage || $form.find(PLACEHOLDER_GENERIC_ERROR);

    if (isSocial) {
      $warningMessage = $form.find(PLACEHOLDER_SOCIAL_ERROR);
    }

    // Override generic Form generic error message with @msgErrorCustom
    if (!msgErrorCustom && objFormConfigVO.msgGenericError) {
      msgErrorCustom = objFormConfigVO.msgGenericError;
    }

    var modKOID = window.APP.modules.KOID;
    if (msgErrorCustom === modKOID.MSG_ERROR_EMAIL_ALREADY_EXISTS) {
      $form.find('.warning-message-social').html(msgErrorCustom).addClass(ERROR_CLASS.slice(1));
      $('.viewKOID-login').addClass('emailError');
    } else {
      $warningMessage.html(msgErrorCustom || module.MSG_ERROR_GENERIC)
                   .addClass(ERROR_CLASS.slice(1));
    }

    if (!isSocial) {
      $('.modal').addClass(ERROR_CLASS.slice(1));
    }

    scrollToTarget($warningMessage);
    PubSub.publish(app.notifications.VALIDATION_ERROR, objFormConfigVO);
    $window.trigger('resize');

    // Set focus on field with error
    if (!$fieldToFocus) {
      // $fieldToFocus = $form.find('input' + ERROR_CLASS + ':not([type="checkbox"]), textarea' + ERROR_CLASS)
      //.first();
      $fieldToFocus = $form.find('input' + ERROR_CLASS + ', textarea' + ERROR_CLASS).first();
    }
    if ($($fieldToFocus)[0]) {
      // module.setFocusOn($fieldToFocus.not('[type="checkbox"]'));
      module.setFocusOn($fieldToFocus);
    } else {
      $form.find('input, textarea')
           // .not('[type="checkbox"]')
           .trigger('focus').trigger('blur');
    }
  };
  /**
  * Hide warning message.
  *
  * @method module.hideWarningMessage
  * @public
  *
  * @param {!jQuery DOM} $form <form> element to validate.
  *
  * @return {Void}
  **/
  module.hideWarningMessage = function($form) {
    var objFormConfigVO = $form.data(module.DATA_VO);
    var $warningMessage = objFormConfigVO.$warningMessage || $form.find(PLACEHOLDER_GENERIC_ERROR);

    $warningMessage.empty()
                   .removeClass(ERROR_CLASS.slice(1));
  };

  /**
  * Highlight field with error
  *
  * @method module.setFieldError
  * @public
  *
  * @param {!jQuery DOM} $field Field element to highlight.
  * @param {?Boolean} hasFieldError Highlight field as "error" or just "reset" field state
  *
  * @return {Self} UTILS.Form
  **/
  module.setFieldError = function($field, hasFieldError) {
    if (!$field || !$field[0]) {
      throw 'Error::Required param objFormItemVO is missing or not found.';
    }

    if (!hasFieldError) {
      removeErrorClass($field);
      return this;
    }
    addErrorClass($field);
    // module.setFocusOn($field.not('[type="checkbox"]'));
    module.setFocusOn($field);

    return this;
  };
  function addErrorClass($field) {
    var isCheckbox = ($field.prop('type') === 'checkbox');
    var isDropdown = $field.is('select');
    var errorClass = ERROR_CLASS.slice(1);

    if (isCheckbox) {
      $field.addClass(errorClass)
            .parent().addClass(errorClass);
    } else if (isDropdown) {
      $field.addClass(errorClass);
    } else {
      $field.addClass(errorClass)
            .parent().addClass(errorClass);
    }
  }
  function removeErrorClass($field) {
    var isCheckbox = ($field.prop('type') === 'checkbox');
    var isDropdown = $field.is('select');
    var errorClass = ERROR_CLASS.slice(1);

    if (isCheckbox) {
      $field.removeClass(errorClass)
            .parent().removeClass(errorClass);
    } else if (isDropdown) {
      $field.removeClass(errorClass);
    } else {
      $field.removeClass(errorClass)
            .parent().removeClass(errorClass);
    }
  }

  function scrollToTarget($target) {
    if (!$target || !$target[0]) {
      return;
    }

    // $('html, body').stop(true, false).animate({
    //   'scrollTop': parseInt($target.offset().top * 0.85, 10)
    // }, 600);
  }

  return module;
}());
