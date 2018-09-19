"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CLASS_NAME = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _search_result = require("./search_result");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_CLASS_NAME = exports.DEFAULT_CLASS_NAME = "textcomplete-item";
var CALLBACK_METHODS = ["onClick", "onMouseover"];

/** @typedef */


// Declare interface instead of importing Dropdown itself to prevent circular dependency.

/**
 * Encapsulate an item of dropdown.
 */
var DropdownItem = function () {
  function DropdownItem(searchResult, options) {
    var _this = this;

    _classCallCheck(this, DropdownItem);

    this.searchResult = searchResult;
    this.active = false;
    this.className = options.className || DEFAULT_CLASS_NAME;
    this.activeClassName = this.className + " active";

    CALLBACK_METHODS.forEach(function (method) {
      ;_this[method] = _this[method].bind(_this);
    });
  }

  _createClass(DropdownItem, [{
    key: "destroy",


    /**
     * Try to free resources and perform other cleanup operations.
     */
    value: function destroy() {
      this.el.removeEventListener("mousedown", this.onClick, false);
      this.el.removeEventListener("mouseover", this.onMouseover, false);
      this.el.removeEventListener("touchstart", this.onClick, false);
      if (this.active) {
        this.dropdown.activeItem = null;
      }
      // This element has already been removed by {@link Dropdown#clear}.
      this._el = null;
    }

    /**
     * Callbacked when it is appended to a dropdown.
     *
     * @see Dropdown#append
     */

  }, {
    key: "appended",
    value: function appended(dropdown) {
      this.dropdown = dropdown;
      this.siblings = dropdown.items;
      this.index = this.siblings.length - 1;
    }

    /**
     * Deactivate active item then activate itself.
     *
     * @return {this}
     */

  }, {
    key: "activate",
    value: function activate() {
      if (!this.active) {
        var _activeItem = this.dropdown.getActiveItem();
        if (_activeItem) {
          _activeItem.deactivate();
        }
        this.dropdown.activeItem = this;
        this.active = true;
        this.el.className = this.activeClassName;
      }
      return this;
    }

    /**
     * Get the next sibling.
     */

  }, {
    key: "deactivate",


    /** @private */
    value: function deactivate() {
      if (this.active) {
        this.active = false;
        this.el.className = this.className;
        this.dropdown.activeItem = null;
      }
      return this;
    }

    /** @private */

  }, {
    key: "onClick",
    value: function onClick(e) {
      e.preventDefault(); // Prevent blur event
      this.dropdown.select(this);
    }

    /** @private */

  }, {
    key: "onMouseover",
    value: function onMouseover() {
      this.activate();
    }
  }, {
    key: "el",
    get: function get() {
      if (this._el) {
        return this._el;
      }
      var li = document.createElement("li");
      li.className = this.active ? this.activeClassName : this.className;
      var a = document.createElement("a");
      a.innerHTML = this.searchResult.render();
      li.appendChild(a);
      this._el = li;
      li.addEventListener("mousedown", this.onClick);
      li.addEventListener("mouseover", this.onMouseover);
      li.addEventListener("touchstart", this.onClick);
      return li;
    }
  }, {
    key: "next",
    get: function get() {
      var nextIndex = void 0;
      if (this.index === this.siblings.length - 1) {
        if (!this.dropdown.rotate) {
          return null;
        }
        nextIndex = 0;
      } else {
        nextIndex = this.index + 1;
      }
      return this.siblings[nextIndex];
    }

    /**
     * Get the previous sibling.
     */

  }, {
    key: "prev",
    get: function get() {
      var nextIndex = void 0;
      if (this.index === 0) {
        if (!this.dropdown.rotate) {
          return null;
        }
        nextIndex = this.siblings.length - 1;
      } else {
        nextIndex = this.index - 1;
      }
      return this.siblings[nextIndex];
    }
  }]);

  return DropdownItem;
}();

exports.default = DropdownItem;
//# sourceMappingURL=dropdown_item.js.map