"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require("eventemitter3");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _dropdown_item = require("./dropdown_item");

var _dropdown_item2 = _interopRequireDefault(_dropdown_item);

var _search_result = require("./search_result");

var _search_result2 = _interopRequireDefault(_search_result);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_CLASS_NAME = "dropdown-menu textcomplete-dropdown";

/** @typedef */

/**
 * Encapsulate a dropdown view.
 *
 * @prop {boolean} shown - Whether the #el is shown or not.
 * @prop {DropdownItem[]} items - The array of rendered dropdown items.
 */
var Dropdown = function (_EventEmitter) {
  _inherits(Dropdown, _EventEmitter);

  _createClass(Dropdown, null, [{
    key: "createElement",
    value: function createElement() {
      var el = document.createElement("ul");
      var style = el.style;
      style.display = "none";
      style.position = "absolute";
      style.zIndex = "10000";
      var body = document.body;
      if (body) {
        body.appendChild(el);
      }
      return el;
    }
  }]);

  function Dropdown(options) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

    _this.shown = false;
    _this.items = [];
    _this.activeItem = null;
    _this.footer = options.footer;
    _this.header = options.header;
    _this.maxCount = options.maxCount || 10;
    _this.el.className = options.className || DEFAULT_CLASS_NAME;
    _this.rotate = options.hasOwnProperty("rotate") ? options.rotate : true;
    _this.placement = options.placement;
    _this.itemOptions = options.item || {};
    var style = options.style;
    if (style) {
      Object.keys(style).forEach(function (key) {
        ;_this.el.style[key] = style[key];
      });
    }
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Dropdown, [{
    key: "destroy",
    value: function destroy() {
      var parentNode = this.el.parentNode;
      if (parentNode) {
        parentNode.removeChild(this.el);
      }
      this.clear()._el = null;
      return this;
    }
  }, {
    key: "render",


    /**
     * Render the given data as dropdown items.
     *
     * @return {this}
     */
    value: function render(searchResults, cursorOffset) {
      var _this2 = this;

      var renderEvent = (0, _utils.createCustomEvent)("render", { cancelable: true });
      this.emit("render", renderEvent);
      if (renderEvent.defaultPrevented) {
        return this;
      }
      var rawResults = searchResults.map(function (searchResult) {
        return searchResult.data;
      });
      var dropdownItems = searchResults.slice(0, this.maxCount || searchResults.length).map(function (searchResult) {
        return new _dropdown_item2.default(searchResult, _this2.itemOptions);
      });
      this.clear().setStrategyId(searchResults[0]).renderEdge(rawResults, "header").append(dropdownItems).renderEdge(rawResults, "footer").show().setOffset(cursorOffset);
      this.emit("rendered", (0, _utils.createCustomEvent)("rendered"));
      return this;
    }

    /**
     * Hide the dropdown then sweep out items.
     *
     * @return {this}
     */

  }, {
    key: "deactivate",
    value: function deactivate() {
      return this.hide().clear();
    }

    /**
     * @return {this}
     */

  }, {
    key: "select",
    value: function select(dropdownItem) {
      var detail = { searchResult: dropdownItem.searchResult };
      var selectEvent = (0, _utils.createCustomEvent)("select", {
        cancelable: true,
        detail: detail
      });
      this.emit("select", selectEvent);
      if (selectEvent.defaultPrevented) {
        return this;
      }
      this.deactivate();
      this.emit("selected", (0, _utils.createCustomEvent)("selected", { detail: detail }));
      return this;
    }

    /**
     * @return {this}
     */

  }, {
    key: "up",
    value: function up(e) {
      return this.shown ? this.moveActiveItem("prev", e) : this;
    }

    /**
     * @return {this}
     */

  }, {
    key: "down",
    value: function down(e) {
      return this.shown ? this.moveActiveItem("next", e) : this;
    }

    /**
     * Retrieve the active item.
     */

  }, {
    key: "getActiveItem",
    value: function getActiveItem() {
      return this.activeItem;
    }

    /**
     * Add items to dropdown.
     *
     * @private
     */

  }, {
    key: "append",
    value: function append(items) {
      var _this3 = this;

      var fragment = document.createDocumentFragment();
      items.forEach(function (item) {
        _this3.items.push(item);
        item.appended(_this3);
        fragment.appendChild(item.el);
      });
      this.el.appendChild(fragment);
      return this;
    }

    /** @private */

  }, {
    key: "setOffset",
    value: function setOffset(cursorOffset) {
      var doc = document.documentElement;
      if (doc) {
        var elementWidth = this.el.offsetWidth;
        if (cursorOffset.left) {
          var browserWidth = doc.clientWidth;
          if (cursorOffset.left + elementWidth > browserWidth) {
            cursorOffset.left = browserWidth - elementWidth;
          }
          this.el.style.left = cursorOffset.left + "px";
        } else if (cursorOffset.right) {
          if (cursorOffset.right - elementWidth < 0) {
            cursorOffset.right = 0;
          }
          this.el.style.right = cursorOffset.right + "px";
        }
        if (this.isPlacementTop()) {
          this.el.style.bottom = doc.clientHeight - cursorOffset.top + cursorOffset.lineHeight + "px";
        } else {
          this.el.style.top = cursorOffset.top + "px";
        }
      }
      return this;
    }

    /**
     * Show the element.
     *
     * @private
     */

  }, {
    key: "show",
    value: function show() {
      if (!this.shown) {
        var showEvent = (0, _utils.createCustomEvent)("show", { cancelable: true });
        this.emit("show", showEvent);
        if (showEvent.defaultPrevented) {
          return this;
        }
        this.el.style.display = "block";
        this.shown = true;
        this.emit("shown", (0, _utils.createCustomEvent)("shown"));
      }
      return this;
    }

    /**
     * Hide the element.
     *
     * @private
     */

  }, {
    key: "hide",
    value: function hide() {
      if (this.shown) {
        var hideEvent = (0, _utils.createCustomEvent)("hide", { cancelable: true });
        this.emit("hide", hideEvent);
        if (hideEvent.defaultPrevented) {
          return this;
        }
        this.el.style.display = "none";
        this.shown = false;
        this.emit("hidden", (0, _utils.createCustomEvent)("hidden"));
      }
      return this;
    }

    /**
     * Clear search results.
     *
     * @private
     */

  }, {
    key: "clear",
    value: function clear() {
      this.el.innerHTML = "";
      this.items.forEach(function (item) {
        return item.destroy();
      });
      this.items = [];
      return this;
    }

    /** @private */

  }, {
    key: "moveActiveItem",
    value: function moveActiveItem(direction, e) {
      var nextActiveItem = direction === "next" ? this.activeItem ? this.activeItem.next : this.items[0] : this.activeItem ? this.activeItem.prev : this.items[this.items.length - 1];
      if (nextActiveItem) {
        nextActiveItem.activate();
        e.preventDefault();
      }
      return this;
    }

    /** @private */

  }, {
    key: "setStrategyId",
    value: function setStrategyId(searchResult) {
      var strategyId = searchResult && searchResult.strategy.props.id;
      if (strategyId) {
        this.el.setAttribute("data-strategy", strategyId);
      } else {
        this.el.removeAttribute("data-strategy");
      }
      return this;
    }

    /**
     * @private
     * @param {object[]} rawResults - What callbacked by search function.
     */

  }, {
    key: "renderEdge",
    value: function renderEdge(rawResults, type) {
      var source = (type === "header" ? this.header : this.footer) || "";
      var content = typeof source === "function" ? source(rawResults) : source;
      var li = document.createElement("li");
      li.classList.add("textcomplete-" + type);
      li.innerHTML = content;
      this.el.appendChild(li);
      return this;
    }

    /** @private */

  }, {
    key: "isPlacementTop",
    value: function isPlacementTop() {
      return this.placement === "top";
    }
  }, {
    key: "el",
    get: function get() {
      if (!this._el) {
        this._el = Dropdown.createElement();
      }
      return this._el;
    }
  }]);

  return Dropdown;
}(_eventemitter2.default);

exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map