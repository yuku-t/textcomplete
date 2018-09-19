'use strict';

var _index = require('../index');

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./main.css');

global.Textarea = _index.Textarea;
global.Textcomplete = _index.Textcomplete;

_highlight2.default.initHighlightingOnLoad();

function initializeTextcompletes() {
  var els = document.getElementsByClassName('auto-eval');
  for (var i = 0, l = els.length; i < l; i++) {
    var el = els[i];
    eval('(function () {' + (el.innerText || el.textContent) + '})()');
  }
}

function runDemo() {
  ['textarea1', 'textarea2', 'textarea3'].forEach(function (id) {
    var textarea = document.getElementById(id);
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    var event = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    event.keyCode = 65;
    textarea.dispatchEvent(event);
  });

  document.getElementById('textarea1').focus();
}

window.addEventListener('DOMContentLoaded', initializeTextcompletes);
window.addEventListener('load', runDemo);
//# sourceMappingURL=main.js.map