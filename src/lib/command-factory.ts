import ChangelogLoader from './changelog-loader';
import ChangelogParser from './changelog-parser';
import ConfigStore from './config-store';
import ExtensionStore from './extension-store';
import ChangelogAssigner from './changelog-assigner';
import Main from './main';
import FileSystem from './file-system';
import ContentProvider from './content-provider';

export default class CommandFactory {
  private fileSystem: FileSystem;
  private vscode: any;
  private cache: Map<string, any>;

  constructor (fs: FileSystem, vscode: any) {
    this.fileSystem = fs;
    this.vscode = vscode;

    this.cache = new Map();
  }

  createMain () {
    return new Main(this.getExtensionStore(), this.vscode);
  }

  createContentProvider () {
    const changelogParser = new ChangelogParser();
    const changelogLoader = new ChangelogLoader(this.fileSystem, changelogParser);
    const changelogAssigner = new ChangelogAssigner(changelogLoader);
    return new ContentProvider(changelogAssigner, this.getExtensionStore());
  }

  private getExtensionStore () {
    return this.getCached(
      'extensionStore',
      () => new ExtensionStore(new ConfigStore(this.vscode.workspace))
    );
  }

  private getCached (key: string, createFunction: any) {
    if (!this.cache.has(key)) {
      this.cache.set(key, createFunction());
    }
    return this.cache.get(key);
  }
}
