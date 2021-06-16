'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getHeader = function getHeader() {
  return ['msgid ""', 'msgstr ""'].join('\n');
};
var getHardcodedFields = function getHardcodedFields() {
  return ['"MIME-Version: 1.0\\n"', '"Content-Type: text/plain; charset=UTF-8\\n"', '"Content-Transfer-Encoding: 8bit\\n"', '"Last-Translator: Automatically generated\\n"', '"Language-Team: none\\n"'].join('\n');
};

var getProjectIdVersion = function getProjectIdVersion(version) {
  return '"Project-Id-Version: ' + version + '\\n"';
};
var getReportMsgidBugsTo = function getReportMsgidBugsTo(url) {
  return '"Report-Msgid-Bugs-To: ' + url + '\\n"';
};
var getXgenerator = function getXgenerator(version) {
  return '"X-Generator: ' + version + '\\n"';
};
var getCreationDate = function getCreationDate(dateString) {
  return '"POT-Creation-Date: ' + dateString + '\\n"';
};
var getRevisionDate = function getRevisionDate(dateString) {
  return '"PO-Revision-Date: ' + dateString + '\\n"';
};
var getLanguage = function getLanguage(langCode) {
  return '"Language: ' + langCode + '\\n"';
};

exports.default = function (_ref) {
  var projectIdVersion = _ref.projectIdVersion,
      reportMsgidBugsTo = _ref.reportMsgidBugsTo,
      language = _ref.language;

  var nowISODateTime = new Date().toISOString();
  var lines = [getHeader(), getProjectIdVersion(projectIdVersion), getReportMsgidBugsTo(reportMsgidBugsTo), getHardcodedFields(), getXgenerator((0, _utils.buildVersionFromPackageJson)(_package2.default)), getCreationDate(nowISODateTime), getRevisionDate(nowISODateTime)];
  if (language) {
    lines.push(getLanguage(language));
  }
  return lines.join('\n');
};