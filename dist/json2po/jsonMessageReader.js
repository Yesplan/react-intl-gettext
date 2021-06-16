'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _fs = require('fs');

var _glob = require('glob');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (_ref) {
  var _ref$messagesPattern = _ref.messagesPattern,
      messagesPattern = _ref$messagesPattern === undefined ? '**/*.json' : _ref$messagesPattern,
      _ref$cwd = _ref.cwd,
      cwd = _ref$cwd === undefined ? process.cwd() : _ref$cwd,
      ignore = _ref.ignore;

  var ids = new Set();
  return (0, _glob.sync)(messagesPattern, { cwd: cwd, ignore: ignore }).map(function (filename) {
    var parsedMessages = JSON.parse((0, _fs.readFileSync)((0, _path.join)(cwd, filename), 'utf-8'));
    return {
      filename: filename,
      messages: Array.isArray(parsedMessages) ? parsedMessages : []
    };
  }).reduce(function (mappedMessages, _ref2) {
    var filename = _ref2.filename,
        messages = _ref2.messages;
    return [].concat(_toConsumableArray(mappedMessages), _toConsumableArray(messages.map(function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          id = _ref3.id,
          defaultMessage = _ref3.defaultMessage,
          description = _ref3.description,
          translatedMessage = _ref3.translatedMessage,
          _ref3$file = _ref3.file,
          file = _ref3$file === undefined ? filename : _ref3$file,
          _ref3$start = _ref3.start;

      _ref3$start = _ref3$start === undefined ? {} : _ref3$start;
      var startLine = _ref3$start.line;

      if (ids.has(id)) {
        throw new Error('The id ' + id + ' found in ' + filename + ' was already defined');
      }
      ids.add(id);
      return {
        reference: startLine ? file + ':startLine' : file,
        description: description,
        id: id,
        defaultMessage: defaultMessage,
        translatedMessage: translatedMessage
      };
    })));
  }, []);
};