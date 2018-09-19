"use strict";

var _textcomplete = require("./textcomplete");

var _textcomplete2 = _interopRequireDefault(_textcomplete);

var _textarea = require("./textarea");

var _textarea2 = _interopRequireDefault(_textarea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editors = void 0;
if (global.Textcomplete && global.Textcomplete.editors) {
  editors = global.Textcomplete.editors;
} else {
  editors = {};
}
editors.Textarea = _textarea2.default;

global.Textcomplete = _textcomplete2.default;
global.Textcomplete.editors = editors;
//# sourceMappingURL=main.js.map