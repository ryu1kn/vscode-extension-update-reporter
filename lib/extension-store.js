class ExtensionStore {
  constructor () {
    this._storage = []
  }

  set (extensions) {
    this._storage = extensions
  }

  getAll (extensions) {
    return this._storage
  }
}

module.exports = ExtensionStore
