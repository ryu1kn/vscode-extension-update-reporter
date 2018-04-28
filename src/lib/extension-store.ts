import Extension from "./entities/extension";

export default class ExtensionStore {
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
