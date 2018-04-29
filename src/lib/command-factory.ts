import ChangelogLoader from './changelog-loader';
import ChangelogParser from './changelog-parser';
import ConfigStore from './config-store';
import ExtensionStore from './extension-store';
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator';
import Main from './main';
import FileSystem from './file-system';

export default class CommandFactory {
  private fileSystem: FileSystem;
  private vscode: any;
  private cache: Map<string, any>;

  constructor (fs: FileSystem, vscode: any) {
    this.fileSystem = fs;
    this.vscode = vscode;

    this.cache = new Map();
  }

  createReportGenerator () {
    const changelogParser = new ChangelogParser();
    const changelogLoader = new ChangelogLoader(this.fileSystem, changelogParser);
    return new ExtensionUpdatesReportGenerator(this.getConfigStore(), changelogLoader, this.getExtensionStore());
  }

  createMain () {
    return new Main(this.getConfigStore(), this.getExtensionStore(), this.vscode);
  }

  private getConfigStore () {
    return this.getCached(
      'configStore',
      () => new ConfigStore(this.vscode.workspace)
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
