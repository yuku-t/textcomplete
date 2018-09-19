"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _update = require("undate/lib/update");

var _update2 = _interopRequireDefault(_update);

var _editor = require("./editor");

var _editor2 = _interopRequireDefault(_editor);

var _utils = require("./utils");

var _search_result = require("./search_result");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getCaretCoordinates = require("textarea-caret");

var CALLBACK_METHODS = ["onInput", "onKeydown"];

/**
 * Encapsulate the target textarea element.
 */

var Textarea = function (_Editor) {
  _inherits(Textarea, _Editor);

  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  function Textarea(el) {
    _classCallCheck(this, Textarea);

    var _this = _possibleConstructorReturn(this, (Textarea.__proto__ || Object.getPrototypeOf(Textarea)).call(this));

    _this.el = el;

    CALLBACK_METHODS.forEach(function (method) {
      ;_this[method] = _this[method].bind(_this);
    });

    _this.startListening();
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Textarea, [{
    key: "destroy",
    value: function destroy() {
      _get(Textarea.prototype.__proto__ || Object.getPrototypeOf(Textarea.prototype), "destroy", this).call(this);
      this.stopListening()
      // Release the element reference early to help garbage collection.
      ;this.el = null;
      return this;
    }

    /**
     * Implementation for {@link Editor#applySearchResult}
     */

  }, {
    key: "applySearchResult",
    value: function applySearchResult(searchResult) {
      var before = this.getBeforeCursor();
      if (before != null) {
        var replace = searchResult.replace(before, this.getAfterCursor());
        this.el.focus(); // Clicking a dropdown item removes focus from the element.
        if (Array.isArray(replace)) {
          (0, _update2.default)(this.el, replace[0], replace[1]);
          this.el.dispatchEvent(new Event("input"));
        }
      }
    }

    /**
     * Implementation for {@link Editor#getCursorOffset}
     */

  }, {
    key: "getCursorOffset",
    value: function getCursorOffset() {
      var elOffset = (0, _utils.calculateElementOffset)(this.el);
      var elScroll = this.getElScroll();
      var cursorPosition = this.getCursorPosition();
      var lineHeight = (0, _utils.getLineHeightPx)(this.el);
      var top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
      var left = elOffset.left - elScroll.left + cursorPosition.left;
      if (this.el.dir !== "rtl") {
        return { top: top, left: left, lineHeight: lineHeight };
      } else {
        var right = document.documentElement ? document.documentElement.clientWidth - left : 0;
        return { top: top, right: right, lineHeight: lineHeight };
      }
    }

    /**
     * Implementation for {@link Editor#getBeforeCursor}
     */

  }, {
    key: "getBeforeCursor",
    value: function getBeforeCursor() {
      return this.el.selectionStart !== this.el.selectionEnd ? null : this.el.value.substring(0, this.el.selectionEnd);
    }

    /** @private */

  }, {
    key: "getAfterCursor",
    value: function getAfterCursor() {
      return this.el.value.substring(this.el.selectionEnd);
    }

    /** @private */

  }, {
    key: "getElScroll",
    value: function getElScroll() {
      return { top: this.el.scrollTop, left: this.el.scrollLeft };
    }

    /**
     * The input cursor's relative coordinates from the textarea's left
     * top corner.
     *
     * @private
     */

  }, {
    key: "getCursorPosition",
    value: function getCursorPosition() {
      return getCaretCoordinates(this.el, this.el.selectionEnd);
    }

    /** @private */

  }, {
    key: "onInput",
    value: function onInput() {
      this.emitChangeEvent();
    }

    /** @private */

  }, {
    key: "onKeydown",
    value: function onKeydown(e) {
      var code = this.getCode(e);
      var event = void 0;
      if (code === "UP" || code === "DOWN") {
        event = this.emitMoveEvent(code);
      } else if (code === "ENTER") {
        event = this.emitEnterEvent();
      } else if (code === "ESC") {
        event = this.emitEscEvent();
      }
      if (event && event.defaultPrevented) {
        e.preventDefault();
      }
    }

    /** @private */

  }, {
    key: "startListening",
    value: function startListening() {
      this.el.addEventListener("input", this.onInput);
      this.el.addEventListener("keydown", this.onKeydown);
    }

    /** @private */

  }, {
    key: "stopListening",
    value: function stopListening() {
      this.el.removeEventListener("input", this.onInput);
      this.el.removeEventListener("keydown", this.onKeydown);
    }
  }]);

  return Textarea;
}(_editor2.default);

exports.default = Textarea;
//# sourceMappingURL=textarea.js.map