import {PreloadedExtension, RawExtension} from './entities/extension';
import {parseVersion, Version} from './entities/version';
import {mapObject, ObjectMap} from './utils';
import ConfigStore from './config-store';

export type ExtensionVersionMap = {
  [extensionId: string]: Version
};

export default class ExtensionStore {
  private configStore: ConfigStore;
  private loadedExtensions: PreloadedExtension[] = [];

  constructor(configStore: ConfigStore) {
    this.configStore = configStore;
  }

  private get lastCheckedVersions (): ExtensionVersionMap {
    return mapObject(this.configStore.lastCheckedVersions, parseVersion);
  }

  memoLoadedExtensions (extensions: RawExtension[]): void {
    const versionMap = this.lastCheckedVersions;
    this.loadedExtensions = extensions.map(
      extension => extension.withPrevInstalledVersion(versionMap[extension.id])
    );
  }

  hasUpdatedExtensions () {
    return this.getUpdatedExtensions().length !== 0;
  }

  getUpdatedExtensions (): PreloadedExtension[] {
    return this.loadedExtensions.filter(extension => extension.hasBeenUpdated());
  }

  async persistLoadedExtensions(): Promise<void> {
    const versionMap = this.getExtensionVersionMap(this.loadedExtensions);
    await this.configStore.updateLastCheckedVersions(versionMap);
  }

  private getExtensionVersionMap (extensions: PreloadedExtension[]): ObjectMap {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version.toString() }),
      {}
    );
  }
}
