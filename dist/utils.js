'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildVersionFromPackageJson = exports.getRepositoryUrlFromPackageJson = exports.getUserPackageJson = undefined;

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserPackageJson = exports.getUserPackageJson = function getUserPackageJson() {
  var path = (0, _path.resolve)(process.cwd(), 'package.json');
  if (_fs2.default.existsSync(path)) {
    return JSON.parse(_fs2.default.readFileSync(path));
  }
  return {};
};

var getRepositoryUrlFromPackageJson = exports.getRepositoryUrlFromPackageJson = function getRepositoryUrlFromPackageJson(pkg) {
  return pkg.repository || 'none';
};
var buildVersionFromPackageJson = exports.buildVersionFromPackageJson = function buildVersionFromPackageJson(pkg) {
  return pkg.name + ' ' + pkg.version;
};