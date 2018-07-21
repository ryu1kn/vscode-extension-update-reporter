import {PreloadedExtension, RawExtension} from './entities/extension';
import ConfigStore from './config-store';
import {createNullVersion} from './entities/version';

export default class ExtensionStore {
  private readonly configStore: ConfigStore;
  private extensions: PreloadedExtension[] = [];

  constructor(configStore: ConfigStore) {
    this.configStore = configStore;
  }

  memoLoadedExtensions(extensions: RawExtension[]): void {
    const versionMap = this.configStore.lastCheckedVersions;
    this.extensions = extensions.map(
      extension => extension.withPrevInstalledVersion(versionMap.get(extension.id, createNullVersion()))
    );
  }

  hasUpdatedExtensions() {
    return this.getUpdatedExtensions().length !== 0;
  }

  getUpdatedExtensions(): PreloadedExtension[] {
    return this.extensions.filter(extension => extension.hasBeenUpdated());
  }

  async persistLoadedExtensions(): Promise<void> {
    await this.configStore.updateLastCheckedVersions(this.extensions);
  }
}
