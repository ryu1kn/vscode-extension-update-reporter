class ExtensionStore {
  private _storage: any

  constructor () {
    this._storage = []
  }

  set (extensions: any) {
    this._storage = extensions
  }

  getAll (extensions: any) {
    return this._storage
  }
}

export default ExtensionStore
