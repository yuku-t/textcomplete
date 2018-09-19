"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateElementOffset = calculateElementOffset;
exports.getLineHeightPx = getLineHeightPx;
exports.calculateLineHeightPx = calculateLineHeightPx;


/**
 * Create a custom event
 *
 * @private
 */
var createCustomEvent = exports.createCustomEvent = function () {
  if (typeof window.CustomEvent === "function") {
    return function (type, options) {
      return new document.defaultView.CustomEvent(type, {
        cancelable: options && options.cancelable || false,
        detail: options && options.detail || undefined
      });
    };
  } else {
    // Custom event polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#polyfill
    return function (type, options) {
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent(type,
      /* bubbles */false, options && options.cancelable || false, options && options.detail || undefined);
      return event;
    };
  }
}();

/**
 * Get the current coordinates of the `el` relative to the document.
 *
 * @private
 */
function calculateElementOffset(el) {
  var rect = el.getBoundingClientRect();
  var _el$ownerDocument = el.ownerDocument,
      defaultView = _el$ownerDocument.defaultView,
      documentElement = _el$ownerDocument.documentElement;

  var offset = {
    top: rect.top + defaultView.pageYOffset,
    left: rect.left + defaultView.pageXOffset
  };
  if (documentElement) {
    offset.top -= documentElement.clientTop;
    offset.left -= documentElement.clientLeft;
  }
  return offset;
}

var CHAR_CODE_ZERO = "0".charCodeAt(0);
var CHAR_CODE_NINE = "9".charCodeAt(0);

function isDigit(charCode) {
  return charCode >= CHAR_CODE_ZERO && charCode <= CHAR_CODE_NINE;
}

/**
 * Returns the line-height of the given node in pixels.
 *
 * @private
 */
function getLineHeightPx(node) {
  var computedStyle = window.getComputedStyle(node);

  // If the char code starts with a digit, it is either a value in pixels,
  // or unitless, as per:
  // https://drafts.csswg.org/css2/visudet.html#propdef-line-height
  // https://drafts.csswg.org/css2/cascade.html#computed-value
  if (isDigit(computedStyle.lineHeight.charCodeAt(0))) {
    // In real browsers the value is *always* in pixels, even for unit-less
    // line-heights. However, we still check as per the spec.
    if (isDigit(computedStyle.lineHeight.charCodeAt(computedStyle.lineHeight.length - 1))) {
      return parseFloat(computedStyle.lineHeight) * parseFloat(computedStyle.fontSize);
    } else {
      return parseFloat(computedStyle.lineHeight);
    }
  }

  // Otherwise, the value is "normal".
  // If the line-height is "normal", calculate by font-size
  return calculateLineHeightPx(node.nodeName, computedStyle);
}

/**
 * Returns calculated line-height of the given node in pixels.
 *
 * @private
 */
function calculateLineHeightPx(nodeName, computedStyle) {
  var body = document.body;
  if (!body) {
    return 0;
  }

  var tempNode = document.createElement(nodeName);
  tempNode.innerHTML = "&nbsp;";
  tempNode.style.fontSize = computedStyle.fontSize;
  tempNode.style.fontFamily = computedStyle.fontFamily;
  tempNode.style.padding = "0";
  body.appendChild(tempNode);

  // Make sure textarea has only 1 row
  if (tempNode instanceof HTMLTextAreaElement) {
    ;tempNode.rows = 1;
  }

  // Assume the height of the element is the line-height
  var height = tempNode.offsetHeight;
  body.removeChild(tempNode);

  return height;
}
//# sourceMappingURL=utils.js.map