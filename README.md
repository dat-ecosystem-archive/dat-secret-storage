# dat-secret-storage

Store secret keys for hyperdrive archives in the user's home directory.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Features

* Store secret keys away from data: prevent users from accidentally sharing the secret key for an archive.
* Allow interoperability between dat applications: any dat application can access a writable archive by using the same storage.

## Install

```
npm install dat-secret-storage
```

## Usage

```js
var storage = require('dat-secret-storage')

var publicDir = path.join(process.cwd(), '.dat')

// store secret key in ~/.dat/secret_keys
var archive = hyperdrive(storage(publicDir)) 
```

## API

Pass to `hyperdrive` as first argument, the storage function.

### `storage(publicStorage, [secretStorage])`

* `publicStorage` can be directory or function abstract-random-access module.
* `secretStorage` defaults to `~/.dat/secret_keys/<discovery-key>`. Can pass in a custom function that takes `pubKey` as argument and returns `write` and `read` functions.

### Example Uses

A few examples of how you may use the storage.

```js
// store secret key in another dir
var archive = hyperdrive(storage(publicDir, 'my_secrets'))

// use ram for private storage
var archive = hyperdrive(storage(publicDir, ram))

// use custom secret store
var customStore = function (key) {
  return {
    write: function (offset, buf, cb) {
      // write key
      cb()
    },
    read: function (offset, length, cb) {
      // read key
      cb()
    }
  }
}
var archive = hyperdrive(storage(publicDir, customStore))
```

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dat-secret-storage.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-secret-storage
[travis-image]: https://img.shields.io/travis/joehand/dat-secret-storage.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dat-secret-storage
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
