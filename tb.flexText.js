/**
 * Teambition Enhanced jQuery flexText: Auto-height textareas
 * --------------------------------------
 * Requires: jQuery 1.7+
 * Usage example: $('textarea').flexText()
 * Info: https://github.com/teambition/flexText
 */

;(function ($) {

  // Constructor
  function FT(elem, onchangeFn) {
    this.$textarea = $(elem);
    this.onchange = typeof onchangeFn === 'function' ? onchangeFn : function () {};

    this._init();
  }

  FT.prototype = {
    _init: function () {
      var _this = this;

      // Insert wrapper elem & pre/span for textarea mirroring
      _this.$textarea.wrap('<div class="flex-text-wrap" />').before('<div><span /><br></div>');

      _this.$span = _this.$textarea.prev().find('span');

      _this.oldValue = '';

      // Add input event listeners
      // * input for modern browsers
      // * propertychange for IE 7 & 8
      // * keyup for IE >= 9: catches keyboard-triggered undos/cuts/deletes
      // * change for IE >= 9: catches mouse-triggered undos/cuts/deletions (when textarea loses focus)
      _this.$textarea.on('input propertychange keyup change', function (e) {
        var value = _this.$textarea.val();
        if (value !== _this.oldValue) {
          _this.oldValue = value;
          _this._mirror(value);
          _this.onchange(e)
        }
      });

      // jQuery val() strips carriage return chars by default (see http://api.jquery.com/val/)
      // This causes issues in IE7, but a valHook can be used to preserve these chars
      $.valHooks.textarea = {
        get: function (elem) {
          return elem.value.replace(/\r?\n/g, "\r\n");
        }
      };

      // Mirror contents once on init
      _this.$textarea.trigger('change');
    }

    // Mirror pre/span & textarea contents
    ,_mirror: function (value) {
      this.$span.text(value);
    }
  };

  // jQuery plugin wrapper
  $.fn.flexText = function (onchangeFn) {
    return this.each(function () {
      // Check if already instantiated on this elem
      if (!$.data(this, 'flexText')) {
        // Instantiate & store elem + string
        $.data(this, 'flexText', new FT(this, onchangeFn));
      }
    });
  };

})(jQuery);
