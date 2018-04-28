import Extension from "./entities/extension";

class ExtensionStore {
  private _storage: Extension[];

  constructor () {
    this._storage = [];
  }

  set (extensions: Extension[]): void {
    this._storage = extensions;
  }

  getAll (): Extension[] {
    return this._storage;
  }
}

export default ExtensionStore;
