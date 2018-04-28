import Extension from "./entities/extension";

class ExtensionStore {
  private storage: Extension[];

  constructor () {
    this.storage = [];
  }

  set (extensions: Extension[]): void {
    this.storage = extensions;
  }

  getAll (): Extension[] {
    return this.storage;
  }
}

export default ExtensionStore;
