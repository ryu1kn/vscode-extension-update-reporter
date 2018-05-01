import ExtensionChangeDataBuilder from './extension-change-data-builder';
import ChangelogLoader from './changelog-loader';
import ExtensionStore from './extension-store';

export default class ExtensionUpdatesReportGenerator {
  private changelogLoader: ChangelogLoader;
  private extensionStore: ExtensionStore;
  private builder = new ExtensionChangeDataBuilder();

  constructor (changelogLoader: ChangelogLoader, extensionStore: ExtensionStore) {
    this.changelogLoader = changelogLoader;
    this.extensionStore = extensionStore;
  }

  async generate (): Promise<string> {
    const lastRecordedVersions = this.extensionStore.extensionVersions;
    const extensions = await Promise.all(
      this.extensionStore.getUpdatedExtensions().map(async extension => {
        const changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension.withHistory(changelog, lastRecordedVersions[extension.id]);
      })
    );
    return this.builder.build(extensions);
  }
}
