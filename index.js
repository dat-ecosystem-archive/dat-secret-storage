var assert = require('assert')
var path = require('path')
var homedir = require('os-homedir')
var raf = require('random-access-file')
var mkdirp = require('mkdirp')
var thunky = require('thunky')
var toDiscovery = require('hypercore/lib/hash').discoveryKey

module.exports = function (publicStorage, secretStorage, opts) {
  assert.ok(publicStorage, 'pass dir or storage for public files')
  if (!opts) opts = {}

  var datStore = {
    metadata: function (name, archive) {
      if (name !== 'secret_key') return getPublicStore('metadata/' + name, archive)
      return getSecretStore(name, archive)
    },
    content: function (name, archive) {
      return getPublicStore('content/' + name, archive)
    }
  }

  return datStore

  function getPublicStore (name, archive) {
    if (typeof publicStorage === 'string') return raf(path.join(publicStorage, name))
    return publicStorage(name, archive)
  }

  function getSecretStore (name, archive) {
    var storage
    if (secretStorage && (typeof secretStorage !== 'string')) storage = secretStorage
    else storage = defaultStore(secretStorage)

    // TODO:
    // - We have to do this because the read for secret key
    //     happens before archive.metadata.key is populated
    // - Can remove if we change how the read works in hyper(core|drive)
    var readPubKey = thunky(function (cb) {
      datStore.metadata('key', archive).read(0, 32, function (err, key) {
        if (err || !key) return cb(err)
        cb(null, toDiscovery(key))
      })
    })

    return {
      write: write,
      read: read
    }

    function write (off, buf, cb) {
      var key = archive.metadata && archive.metadata.discoveryKey
      if (key) return storage(key).write(off, buf, cb)
      readPubKey(function (err, key) {
        if (err) return cb(err)
        storage(key).write(off, buf, cb)
      })
    }

    function read (off, len, cb) {
      var key = archive.metadata && archive.metadata.discoveryKey
      if (key) return storage(key).read(off, len, cb)
      readPubKey(function (err, key) {
        if (err) return cb(err)
        storage(key).read(off, len, cb)
      })
    }
  }

  function defaultStore (dir) {
    if (!dir) dir = path.join(homedir(), '.dat', 'secret_keys')
    mkdirp.sync(dir)
    return function (discKey) {
      if (typeof discKey !== 'string') discKey = discKey.toString('hex')
      return raf(path.join(dir, discKey.slice(0, 2), discKey.slice(2)))
    }
  }
}
