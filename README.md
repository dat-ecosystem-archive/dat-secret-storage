# dat-secret-storage

store secret key for dat in home dir

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Install

```
npm install dat-secret-storage
```

## Usage

```js
var storage = require('dat-secret-storage')

var pubDir = path.join(process.cwd(), '.dat')

// DEFAULT: store secret key in ~/.dat/secret_keys
var archive = hyperdrive(storage(pubDir)) 

// store secret key in another dir
var archive = hyperdrive(storage(pubDir, 'my_secrets'))

// use ram for private storage (just use ram instead...)
var archive = hyperdrive(storage(pubDir, ram))

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
var archive = hyperdrive(storage(pubDir, customStore))
```

## API

Pass to `hyperdrive` as first argument, the storage function.

### `storage(publicStorage, [secretStorage], [opts])`

* `publicStorage` can be string to store in a directory with `raf` or `ram`.
* `secretStorage` defaults to `~/.dat/secret_keys/<pub-key>. Can pass in a custom function that takes `pubKey` as argument and returns `write` and `read` functions.

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dat-secret-storage.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-secret-storage
[travis-image]: https://img.shields.io/travis/joehand/dat-secret-storage.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dat-secret-storage
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
