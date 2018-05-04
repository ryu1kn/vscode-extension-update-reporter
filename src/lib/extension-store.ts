import {PreloadedExtension, RawExtension} from './entities/extension';
import ConfigStore from './config-store';
import {createNullVersion} from './entities/version';

export default class ExtensionStore {
  private configStore: ConfigStore;
  private loadedExtensions: PreloadedExtension[] = [];

  constructor(configStore: ConfigStore) {
    this.configStore = configStore;
  }

  memoLoadedExtensions (extensions: RawExtension[]): void {
    const versionMap = this.configStore.lastCheckedVersions;
    this.loadedExtensions = extensions.map(
      extension => extension.withPrevInstalledVersion(versionMap.get(extension.id, createNullVersion()))
    );
  }

  hasUpdatedExtensions () {
    return this.getUpdatedExtensions().length !== 0;
  }

  getUpdatedExtensions (): PreloadedExtension[] {
    return this.loadedExtensions.filter(extension => extension.hasBeenUpdated());
  }

  async persistLoadedExtensions(): Promise<void> {
    await this.configStore.updateLastCheckedVersions(this.loadedExtensions);
  }
}
