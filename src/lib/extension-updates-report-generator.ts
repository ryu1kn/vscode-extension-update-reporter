import ExtensionChangeDataBuilder from './extension-change-data-builder';
import ConfigStore from "./config-store";
import ChangelogLoader from "./changelog-loader";
import ExtensionStore from "./extension-store";

class ExtensionUpdatesReportGenerator {
  private _configStore: ConfigStore;
  private _changelogLoader: ChangelogLoader;
  private _extensionStore: ExtensionStore;

  constructor (params: any) {
    this._configStore = params.configStore;
    this._changelogLoader = params.changelogLoader;
    this._extensionStore = params.extensionStore;
  }

  async generate (): Promise<string> {
    const builder = new ExtensionChangeDataBuilder();
    const extensions = await Promise.all(
      this._extensionStore.getAll().map(async extension => {
        extension.changelog = await this._changelogLoader.load(
          extension.extensionPath,
          extension.version
        );
        return extension;
      })
    );
    return builder.build(extensions, this._configStore.extensionVersions);
  }
}

export default ExtensionUpdatesReportGenerator;
