import ExtensionChangeDataBuilder from './extension-change-data-builder';
import ConfigStore from "./config-store";
import ChangelogLoader from "./changelog-loader";
import ExtensionStore from "./extension-store";

class ExtensionUpdatesReportGenerator {
  private configStore: ConfigStore;
  private changelogLoader: ChangelogLoader;
  private extensionStore: ExtensionStore;

  constructor (params: any) {
    this.configStore = params.configStore;
    this.changelogLoader = params.changelogLoader;
    this.extensionStore = params.extensionStore;
  }

  async generate (): Promise<string> {
    const builder = new ExtensionChangeDataBuilder();
    const extensions = await Promise.all(
      this.extensionStore.getAll().map(async extension => {
        extension.changelog = await this.changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension;
      })
    );
    return builder.build(extensions, this.configStore.extensionVersions);
  }
}

export default ExtensionUpdatesReportGenerator;
