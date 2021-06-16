#! /usr/bin/env node
'use strict';

var _fs = require('fs');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _headerFormatter = require('./json2po/headerFormatter');

var _headerFormatter2 = _interopRequireDefault(_headerFormatter);

var _potFormatter = require('./json2po/potFormatter');

var _potFormatter2 = _interopRequireDefault(_potFormatter);

var _jsonMessageReader = require('./json2po/jsonMessageReader');

var _jsonMessageReader2 = _interopRequireDefault(_jsonMessageReader);

var _poMessageReader = require('./po2json/poMessageReader');

var _poMessageReader2 = _interopRequireDefault(_poMessageReader);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = function list(value) {
  return value.split(',');
};
var userPkg = (0, _utils.getUserPackageJson)();

_commander2.default.command('json2pot <src> <dest>').description('converts react-intl extracted json to po/pot').option('-p, --pattern [pattern]', 'glob pattern used to find the src files [**/*.json]', '**/*.json').option('-d, --use-default <lang>', 'use defaultMessage as msgstr and use <lang> as value for Language header field').option('-i, --ignore <patterns>', 'add a pattern or an array of glob patterns to exclude matches').option('--project-id-version [version]', 'set the value of Project-Id-Version header field [' + (0, _utils.buildVersionFromPackageJson)(userPkg) + ']', (0, _utils.buildVersionFromPackageJson)(userPkg)).option('--report-msgid-bugs-to [url]', 'set the value of Report-Msgid-Bugs-to header field [' + (0, _utils.getRepositoryUrlFromPackageJson)(userPkg) + ']', (0, _utils.getRepositoryUrlFromPackageJson)(userPkg)).option('--exclude-msgctxt', 'exclude the msgctxt field for entries').option('--source-reference-with-colon', 'use the #: sourcereference format instead of # sourcereference').option('--exclude-description', 'exclude the #. description field for entries').action(function (src, dest, _ref) {
  var pattern = _ref.pattern,
      useDefault = _ref.useDefault,
      ignore = _ref.ignore,
      projectIdVersion = _ref.projectIdVersion,
      reportMsgidBugsTo = _ref.reportMsgidBugsTo,
      excludeMsgctxt = _ref.excludeMsgctxt,
      sourceReferenceWithColon = _ref.sourceReferenceWithColon,
      excludeDescription = _ref.excludeDescription;

  (0, _fs.writeFileSync)(dest, (0, _potFormatter2.default)((0, _jsonMessageReader2.default)({ cwd: src, messagesPattern: pattern, ignore: ignore }), {
    copyDefaultTranslation: !!useDefault,
    header: (0, _headerFormatter2.default)({
      projectIdVersion: projectIdVersion,
      reportMsgidBugsTo: reportMsgidBugsTo,
      language: useDefault
    }),
    excludeMsgctxt: excludeMsgctxt,
    sourceReferenceWithColon: sourceReferenceWithColon,
    excludeDescription: excludeDescription
  }));
});

_commander2.default.command('po2json <src> <dest>').description('converts po files to json').option('-p, --pattern [pattern]', 'glob pattern used to find the src files [' + _poMessageReader.defaultPattern + ']', _poMessageReader.defaultPattern).option('--pretty', 'pretty print json').option('-i, --ignore <patterns>', 'add a pattern or an array of glob patterns to exclude matches', list).option('--lang-matcher-pattern [lang-matcher-pattern]', 'pattern used to match the language from the file name [' + _poMessageReader.defaultNameMatcherPatternString + ']', _poMessageReader.defaultNameMatcherPatternString).action(function (src, dest, _ref2) {
  var pattern = _ref2.pattern,
      pretty = _ref2.pretty,
      ignore = _ref2.ignore,
      langMatcherPattern = _ref2.langMatcherPattern;

  (0, _fs.writeFileSync)(dest, JSON.stringify((0, _poMessageReader2.default)({
    cwd: src,
    messagesPattern: pattern,
    langMatcherPattern: langMatcherPattern,
    ignore: ignore
  }), null, pretty ? '  ' : undefined));
});

_commander2.default.parse(process.argv);