var assert = require('assert')
var path = require('path')
var homedir = require('os-homedir')
var raf = require('random-access-file')

module.exports = function (dir) {
  if (!dir) dir = path.join(homedir(), '.dat', 'secret_keys')
  return function (name, opts) {
    discKey = opts.discoveryKey
    if (typeof discKey !== 'string') discKey = discKey.toString('hex')
    return raf(path.join(dir, discKey.slice(0, 2), discKey.slice(2)))
  }
}
