import ChangelogLoader from './changelog-loader';
import ChangelogParser from './changelog-parser';
import ConfigStore from './config-store';
import ExtensionStore from './extension-store';
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator';
import Main from './main';
import FileSystem from "./file-system";

class CommandFactory {
  private fileSystem: FileSystem;
  private vscode: any;
  private cache: Map<string, any>;

  constructor (params: any) {
    this.fileSystem = params.fileSystem;
    this.vscode = params.vscode;

    this.cache = new Map();
  }

  createReportGenerator () {
    const changelogParser = new ChangelogParser();
    const changelogLoader = new ChangelogLoader({
      changelogParser,
      fileSystem: this.fileSystem
    });
    return new ExtensionUpdatesReportGenerator({
      changelogLoader,
      configStore: this.getConfigStore(),
      extensionStore: this.getExtensionStore()
    });
  }

  createMain () {
    return new Main({
      vscode: this.vscode,
      configStore: this.getConfigStore(),
      extensionStore: this.getExtensionStore()
    });
  }

  private getConfigStore () {
    return this.getCached(
      'configStore',
      () =>
        new ConfigStore({
          vscWorkspace: this.vscode.workspace
        })
    );
  }

  private getExtensionStore () {
    return this.getCached('extensionStore', () => new ExtensionStore());
  }

  private getCached (key: string, createFunction: any) {
    if (!this.cache.has(key)) {
      this.cache.set(key, createFunction());
    }
    return this.cache.get(key);
  }
}

export default CommandFactory;
