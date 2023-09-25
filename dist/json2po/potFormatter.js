'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var escapeString = function escapeString(str) {
  return str.replace(/"/g, '\\"');
};

var buildMessage = function buildMessage(copyDefaultTranslation, excludeMsgctxt, sourceReferenceWithColon, excludeDescription) {
  return function (_ref) {
    var reference = _ref.reference,
        description = _ref.description,
        id = _ref.id,
        defaultMessage = _ref.defaultMessage,
        translatedMessage = _ref.translatedMessage;

    var entry = ['#' + (sourceReferenceWithColon ? ': ' : ' ') + reference];
    if (!excludeDescription) {
      entry = ['#. ' + description].concat(_toConsumableArray(entry));
    }
    if (!excludeMsgctxt) {
      entry.push('msgctxt "' + escapeString(id) + '"');
    }
    entry = [].concat(_toConsumableArray(entry), ['msgid "' + escapeString(defaultMessage) + '"', 'msgstr "' + (copyDefaultTranslation ? escapeString(translatedMessage || defaultMessage) : '') + '"', '']);
    return entry.join('\n');
  };
};

exports.default = function (messages) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      copyDefaultTranslation = _ref2.copyDefaultTranslation,
      _ref2$header = _ref2.header,
      header = _ref2$header === undefined ? '' : _ref2$header,
      _ref2$excludeMsgctxt = _ref2.excludeMsgctxt,
      excludeMsgctxt = _ref2$excludeMsgctxt === undefined ? false : _ref2$excludeMsgctxt,
      _ref2$sourceReference = _ref2.sourceReferenceWithColon,
      sourceReferenceWithColon = _ref2$sourceReference === undefined ? false : _ref2$sourceReference,
      _ref2$excludeDescript = _ref2.excludeDescription,
      excludeDescription = _ref2$excludeDescript === undefined ? false : _ref2$excludeDescript,
      _ref2$sortResults = _ref2.sortResults,
      sortResults = _ref2$sortResults === undefined ? true : _ref2$sortResults;

  var body = (sortResults ? messages.sort(function (msg1, msg2) {
    return ('' + msg1.reference + msg1.id).localeCompare('' + msg2.reference + msg2.id);
  }) : messages).map(buildMessage(copyDefaultTranslation, excludeMsgctxt, sourceReferenceWithColon, excludeDescription)).join('\n');
  return header ? [header, '', body].join('\n') : body;
};