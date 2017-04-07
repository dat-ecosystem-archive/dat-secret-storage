var path = require('path')
var test = require('tape')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var rimraf = require('rimraf')
var storage = require('..')

var pub = path.join(__dirname, 'pub')
var sec = path.join(__dirname, 'secret')

test('Create new archive with default secret', function (t) {
  var archive = hyperdrive(storage(pub))
  archive.ready(function () {
    t.ok(archive.metadata.writable, 'archive is writable')
    t.ok(archive.content.writable, 'archive content is writable')
    t.end()
  })
})

test('Resume archive with default secret', function (t) {
  var archive = hyperdrive(storage(pub))
  archive.ready(function () {
    t.ok(archive.metadata.writable, 'archive is writable')
    t.ok(archive.content.writable, 'archive content is writable')
    rimraf.sync(pub)
    t.end()
  })
})

test('Create new archive with dir storage', function (t) {
  var archive = hyperdrive(storage(pub, sec))
  archive.ready(function () {
    t.ok(archive.metadata.writable, 'archive is writable')
    t.ok(archive.content.writable, 'archive content is writable')
    t.end()
  })
})

test('Use existing archive', function (t) {
  var archive = hyperdrive(storage(pub, sec))
  archive.ready(function () {
    t.ok(archive.metadata.writable, 'archive is writable')
    t.ok(archive.content.writable, 'archive content is writable')
    rimraf.sync(pub)
    rimraf.sync(sec)
    t.end()
  })
})

test('Create new archive with ram', function (t) {
  var archive = hyperdrive(storage(ram, ram))
  archive.ready(function () {
    t.ok(archive.metadata.writable, 'archive is writable')
    t.ok(archive.content.writable, 'archive content is writable')
    t.end()
  })
})

test.onFinish(function () {
  rimraf.sync(pub)
  rimraf.sync(sec)
})
