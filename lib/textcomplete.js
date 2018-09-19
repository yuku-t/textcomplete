"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _completer = require("./completer");

var _completer2 = _interopRequireDefault(_completer);

var _editor = require("./editor");

var _editor2 = _interopRequireDefault(_editor);

var _dropdown = require("./dropdown");

var _dropdown2 = _interopRequireDefault(_dropdown);

var _strategy = require("./strategy");

var _strategy2 = _interopRequireDefault(_strategy);

var _search_result = require("./search_result");

var _search_result2 = _interopRequireDefault(_search_result);

var _eventemitter = require("eventemitter3");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CALLBACK_METHODS = ["handleChange", "handleEnter", "handleEsc", "handleHit", "handleMove", "handleSelect"];

/** @typedef */

/**
 * The core of textcomplete. It acts as a mediator.
 */
var Textcomplete = function (_EventEmitter) {
  _inherits(Textcomplete, _EventEmitter);

  /**
   * @param {Editor} editor - Where the textcomplete works on.
   */
  function Textcomplete(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Textcomplete);

    var _this = _possibleConstructorReturn(this, (Textcomplete.__proto__ || Object.getPrototypeOf(Textcomplete)).call(this));

    _this.completer = new _completer2.default();
    _this.isQueryInFlight = false;
    _this.nextPendingQuery = null;
    _this.dropdown = new _dropdown2.default(options.dropdown || {});
    _this.editor = editor;
    _this.options = options;

    CALLBACK_METHODS.forEach(function (method) {
      ;_this[method] = _this[method].bind(_this);
    });

    _this.startListening();
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Textcomplete, [{
    key: "destroy",
    value: function destroy() {
      var destroyEditor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.completer.destroy();
      this.dropdown.destroy();
      if (destroyEditor) {
        this.editor.destroy();
      }
      this.stopListening();
      return this;
    }

    /**
     * @return {this}
     */

  }, {
    key: "hide",
    value: function hide() {
      this.dropdown.deactivate();
      return this;
    }

    /**
     * @return {this}
     * @example
     * textcomplete.register([{
     *   match: /(^|\s)(\w+)$/,
     *   search: function (term, callback) {
     *     $.ajax({ ... })
     *       .done(callback)
     *       .fail([]);
     *   },
     *   replace: function (value) {
     *     return '$1' + value + ' ';
     *   }
     * }]);
     */

  }, {
    key: "register",
    value: function register(strategyPropsArray) {
      var _this2 = this;

      strategyPropsArray.forEach(function (props) {
        _this2.completer.registerStrategy(new _strategy2.default(props));
      });
      return this;
    }

    /**
     * Start autocompleting.
     *
     * @param {string} text - Head to input cursor.
     * @return {this}
     */

  }, {
    key: "trigger",
    value: function trigger(text) {
      if (this.isQueryInFlight) {
        this.nextPendingQuery = text;
      } else {
        this.isQueryInFlight = true;
        this.nextPendingQuery = null;
        this.completer.run(text);
      }
      return this;
    }

    /** @private */

  }, {
    key: "handleHit",
    value: function handleHit(_ref) {
      var searchResults = _ref.searchResults;

      if (searchResults.length) {
        this.dropdown.render(searchResults, this.editor.getCursorOffset());
      } else {
        this.dropdown.deactivate();
      }
      this.isQueryInFlight = false;
      if (this.nextPendingQuery !== null) {
        this.trigger(this.nextPendingQuery);
      }
    }

    /** @private */

  }, {
    key: "handleMove",
    value: function handleMove(e) {
      e.detail.code === "UP" ? this.dropdown.up(e) : this.dropdown.down(e);
    }

    /** @private */

  }, {
    key: "handleEnter",
    value: function handleEnter(e) {
      var activeItem = this.dropdown.getActiveItem();
      if (activeItem) {
        this.dropdown.select(activeItem);
        e.preventDefault();
      } else {
        this.dropdown.deactivate();
      }
    }

    /** @private */

  }, {
    key: "handleEsc",
    value: function handleEsc(e) {
      if (this.dropdown.shown) {
        this.dropdown.deactivate();
        e.preventDefault();
      }
    }

    /** @private */

  }, {
    key: "handleChange",
    value: function handleChange(e) {
      if (e.detail.beforeCursor != null) {
        this.trigger(e.detail.beforeCursor);
      } else {
        this.dropdown.deactivate();
      }
    }

    /** @private */

  }, {
    key: "handleSelect",
    value: function handleSelect(selectEvent) {
      this.emit("select", selectEvent);
      if (!selectEvent.defaultPrevented) {
        this.editor.applySearchResult(selectEvent.detail.searchResult);
      }
    }

    /** @private */

  }, {
    key: "startListening",
    value: function startListening() {
      var _this3 = this;

      this.editor.on("move", this.handleMove).on("enter", this.handleEnter).on("esc", this.handleEsc).on("change", this.handleChange);
      this.dropdown.on("select", this.handleSelect);["show", "shown", "render", "rendered", "selected", "hidden", "hide"].forEach(function (eventName) {
        _this3.dropdown.on(eventName, function () {
          return _this3.emit(eventName);
        });
      });
      this.completer.on("hit", this.handleHit);
    }

    /** @private */

  }, {
    key: "stopListening",
    value: function stopListening() {
      this.completer.removeAllListeners();
      this.dropdown.removeAllListeners();
      this.editor.removeListener("move", this.handleMove).removeListener("enter", this.handleEnter).removeListener("esc", this.handleEsc).removeListener("change", this.handleChange);
    }
  }]);

  return Textcomplete;
}(_eventemitter2.default);

exports.default = Textcomplete;
//# sourceMappingURL=textcomplete.js.map