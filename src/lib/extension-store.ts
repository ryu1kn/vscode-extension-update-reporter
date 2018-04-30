import {ExtensionMeta} from './entities/extension';
import {parseVersion, Version} from './entities/version';
import {mapObject, ObjectMap} from './utils';
import ConfigStore from './config-store';

export type ExtensionVersionMap = {
  [extensionId: string]: Version
};

export default class ExtensionStore {
  private configStore: ConfigStore;
  private loadedExtensions: ExtensionMeta[] = [];

  constructor(configStore: ConfigStore) {
    this.configStore = configStore;
  }

  get extensionVersions (): ExtensionVersionMap {
    return mapObject(this.configStore.extensionVersions, parseVersion);
  }

  memoLoadedExtensions (extensions: ExtensionMeta[]): void {
    this.loadedExtensions = extensions;
  }

  hasUpdatedExtensions () {
    return this.getUpdatedExtensions().length !== 0;
  }

  getUpdatedExtensions (): ExtensionMeta[] {
    const versionMap = this.extensionVersions;
    return this.loadedExtensions.filter(extension =>
      extension.isNewerThan(versionMap[extension.id])
    );
  }

  async persistLoadedExtensions(): Promise<void> {
    const versionMap = this.getExtensionVersionMap(this.loadedExtensions);
    await this.configStore.updateExtensionVersions(versionMap);
  }

  private getExtensionVersionMap (extensions: ExtensionMeta[]): ObjectMap {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version.toString() }),
      {}
    );
  }
}
