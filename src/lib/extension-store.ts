import { ExtensionMeta } from "./entities/extension";

export default class ExtensionStore {
  private storage: ExtensionMeta[];

  constructor () {
    this.storage = [];
  }

  set (extensions: ExtensionMeta[]): void {
    this.storage = extensions;
  }

  getAll (): ExtensionMeta[] {
    return this.storage;
  }
}
