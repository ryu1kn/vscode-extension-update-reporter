import ExtensionChangeDataBuilder from './extension-change-data-builder';
import ConfigStore from "./config-store";
import ChangelogLoader from "./changelog-loader";
import ExtensionStore from "./extension-store";

export default class ExtensionUpdatesReportGenerator {
  private configStore: ConfigStore;
  private changelogLoader: ChangelogLoader;
  private extensionStore: ExtensionStore;
  private builder = new ExtensionChangeDataBuilder();

  constructor (params: any) {
    this.configStore = params.configStore;
    this.changelogLoader = params.changelogLoader;
    this.extensionStore = params.extensionStore;
  }

  async generate (): Promise<string> {
    const extensions = await Promise.all(
      this.extensionStore.getAll().map(async extension => {
        const changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension.withExtension(changelog);
      })
    );
    return this.builder.build(extensions, this.configStore.extensionVersions);
  }
}
