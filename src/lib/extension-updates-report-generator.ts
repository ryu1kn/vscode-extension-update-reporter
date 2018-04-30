import ExtensionChangeDataBuilder from './extension-change-data-builder';
import ConfigStore from './config-store';
import ChangelogLoader from './changelog-loader';
import ExtensionStore from './extension-store';

export default class ExtensionUpdatesReportGenerator {
  private configStore: ConfigStore;
  private changelogLoader: ChangelogLoader;
  private extensionStore: ExtensionStore;
  private builder = new ExtensionChangeDataBuilder();

  constructor (config: ConfigStore, changelogLoader: ChangelogLoader, extensionStore: ExtensionStore) {
    this.configStore = config;
    this.changelogLoader = changelogLoader;
    this.extensionStore = extensionStore;
  }

  async generate (): Promise<string> {
    const extensions = await Promise.all(
      this.extensionStore.getAll().map(async extension => {
        const changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension.withChangelog(changelog);
      })
    );
    return this.builder.build(extensions, this.configStore.extensionVersions);
  }
}
