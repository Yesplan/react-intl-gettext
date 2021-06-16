'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPattern = exports.defaultNameMatcherPatternString = undefined;

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

    var mergedTranslations = Object.keys(contexts).filter(function (id) {
      return id !== '';
    }).reduce(function (acc, id) {
      return _extends({}, acc, _defineProperty({}, id, Object.keys(contexts[id]).reduce(function (msgstr, nextContextObject, _, array) {
        if (id !== '' && array.length > 1) {
          throw new Error('More than one message was found for the context ' + id);
        }
        if (contexts[id][nextContextObject].msgstr.length > 1) {
          /* eslint-disable no-console */
          console.warn('Plural definitions were found for the context ' + id + '.\n              Plurals are ignored!');
          /* eslint-enable no-console */
        }
        return contexts[id][nextContextObject].msgstr[0];
      }, '')));
    }, {});
    return _defineProperty({}, langMatcher(filename), mergedTranslations);
  });
  return translations.reduce(function (acc, nextFile) {
    return _extends({}, acc, nextFile);
  }, {});
};