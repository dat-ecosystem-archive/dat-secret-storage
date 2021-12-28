[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](https://dat-ecosystem.org/) 

More info on active projects and modules at [dat-ecosystem.org](https://dat-ecosystem.org/) <img src="https://i.imgur.com/qZWlO1y.jpg" width="30" height="30" /> 

---

# dat-secret-storage

Store secret keys for hyperdrive archives in the user's home directory.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Install

```
npm install dat-secret-storage
```

## Usage

Return for the `secret_key` storage in hyperdrive/hypercore. To avoid local ownership conflicts, pass the local directory as the first argument. `dat-secret-storage` will check for a non-empty ownership file in the source directory storage.

```js
var secretStore = require('dat-secret-storage')

var storage = {
  metadata: function (name, opts) {
    if (name === 'secret_key') return secretStore()(path.join(dir, '.dat/metadata.ogd'), opts)
    return // other storage
  },
  content: function (name, opts) {
    return // other storage
  }
}

// store secret key in ~/.dat/secret_keys
var archive = hyperdrive(storage)
```

## API

### `secretStorage([dir])(ownershipFile, opts)`

* `dir`: directory to store keys under `dir/.dat/secret_keys`. Defaults to users home directory.
* `ownershipFile`: non-empty file that denotes ownership. This helps avoid local ownership conflicts of the same dat.

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dat-secret-storage.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-secret-storage
[travis-image]: https://img.shields.io/travis/joehand/dat-secret-storage.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dat-secret-storage
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
