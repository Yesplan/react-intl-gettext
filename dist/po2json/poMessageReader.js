'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPattern = exports.defaultNameMatcherPatternString = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _glob = require('glob');

var _path = require('path');

var _fs = require('fs');

var _gettextParser = require('gettext-parser');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var newNameMatcher = function newNameMatcher(regex) {
  return function (filename) {
    return filename.match(regex)[1];
  };
};

var defaultNameMatcherPatternString = exports.defaultNameMatcherPatternString = '.*-(.*)\\.po$';
var defaultPattern = exports.defaultPattern = '**/*.po';

exports.default = function (_ref) {
  var _ref$messagesPattern = _ref.messagesPattern,
      messagesPattern = _ref$messagesPattern === undefined ? defaultPattern : _ref$messagesPattern,
      _ref$cwd = _ref.cwd,
      cwd = _ref$cwd === undefined ? process.cwd() : _ref$cwd,
      _ref$langMatcherPatte = _ref.langMatcherPattern,
      langMatcherPattern = _ref$langMatcherPatte === undefined ? defaultNameMatcherPatternString : _ref$langMatcherPatte,
      _ref$langMatcher = _ref.langMatcher,
      langMatcher = _ref$langMatcher === undefined ? newNameMatcher(langMatcherPattern) : _ref$langMatcher,
      ignore = _ref.ignore;

  var translations = (0, _glob.sync)(messagesPattern, { cwd: cwd, ignore: ignore }).map(function (filename) {
    var _po$parse = _gettextParser.po.parse((0, _fs.readFileSync)((0, _path.join)(cwd, filename)), 'utf-8'),
        contexts = _po$parse.translations;

    var translationsToProcess = Object.keys(contexts);
    var mergedTranslations = translationsToProcess.reduce(function (messagesForLanguage, contextName) {
      var extendMessagesForLanguage = _extends({}, messagesForLanguage);
      if (contextName !== '' && Object.entries(contexts[contextName]).length > 1) {
        throw new Error('More than one message was found for the context ' + contextName);
      }
      Object.entries(contexts[contextName]).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            msgId = _ref3[0],
            msgObject = _ref3[1];

        var id = msgId;
        if (contextName !== '' && contextName !== msgId) {
          id = contextName;
        }
        if (msgId === '') {
          /* Ignore entries with empty string as key, which store meta data */
          return;
        }
        if (msgObject.msgstr.length > 1) {
          /* eslint-disable no-console */
          console.warn('Plural definitions were found for the context ' + contextName + '.\n               Plurals are ignored!');
          /* eslint-enable no-console */
        }
        extendMessagesForLanguage[id] = msgObject.msgstr[0];
      });
      return extendMessagesForLanguage;
    }, {});
    return _defineProperty({}, langMatcher(filename), mergedTranslations);
  });
  return translations.reduce(function (acc, nextFile) {
    return _extends({}, acc, nextFile);
  }, {});
};