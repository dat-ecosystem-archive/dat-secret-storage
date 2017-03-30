var assert = require('assert')
var path = require('path')
var homedir = require('os-homedir')
var raf = require('random-access-file')
var thunky = require('thunky')
var mkdirp = require('mkdirp')

module.exports = function (publicStorage, secretStorage, opts) {
  assert.ok(publicStorage, 'pass dir or storage for public files')
  if (!opts) opts = {}
  var pubKeyStore = null

  return function (filename) {
    // pubStorage depends on filename
    var pubStorage = (typeof publicStorage === 'string')
      ? raf(path.join(publicStorage, filename))
      : publicStorage(filename)

    var parsed = filename.split('/')
    var file = parsed[1]
    if (file === 'key' && parsed[0] === 'metadata') {
      pubKeyStore = pubStorage
      return pubStorage
    }
    if (file !== 'secret_key') return pubStorage
    // TODO: what do we do with content key?
    if (parsed[0] === 'content') return pubStorage

    var storage = secretStorage
      ? (typeof secretStorage === 'string')
        ? defaultStore(secretStorage)
        : secretStorage
      : defaultStore(path.join(homedir(), '.dat', 'secret_keys'))
    var readPubKey = thunky(function (cb) {
      if (!pubKeyStore) return cb(new Error('no public key storage'))
      pubKeyStore.read(0, 32, function (err, key) {
        if (err || !key) return cb(err)
        process.nextTick(function () {
          cb(null, key)
        })
      })
    })

    return {
      write: write,
      read: read
    }

    function write (off, buf, cb) {
      readPubKey(function (err, key) {
        if (err || !key) return write(off, buf, cb)
        storage(key).write(off, buf, cb)
      })
    }

    function read (off, len, cb) {
      readPubKey(function (err, key) {
        if (err) return cb()
        storage(key).read(off, len, cb)
      })
    }
  }

  function defaultStore (dir) {
    mkdirp.sync(dir)
    return function (pubKey) {
      if (typeof pubKey !== 'string') pubKey = pubKey.toString('hex')
      return raf(path.join(dir, pubKey))
    }
  }
}
