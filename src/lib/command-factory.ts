import ConfigStore from './config-store';
import ExtensionStore from './extension-store';
import Main from './main';
import FileSystem from './file-system';
import ContentProvider from './content-provider';
import MarkdownReportGeneratorFactory from './markdown-report-generator-factory';

export default class CommandFactory {
  private readonly fileSystem: FileSystem;
  private readonly vscode: any;
  private readonly cache: Map<string, any>;

  constructor(fs: FileSystem, vscode: any) {
    this.fileSystem = fs;
    this.vscode = vscode;

    this.cache = new Map();
  }

  createMain() {
    return new Main(this.getExtensionStore(), this.vscode);
  }

  createContentProvider() {
    const markdownReportGenerator = new MarkdownReportGeneratorFactory(this.fileSystem).create();
    return new ContentProvider(markdownReportGenerator, this.getExtensionStore());
  }

  private getExtensionStore() {
    return this.getCached(
      'extensionStore',
      () => new ExtensionStore(new ConfigStore(this.vscode.workspace))
    );
  }

  private getCached(key: string, createFunction: any) {
    if (!this.cache.has(key)) {
      this.cache.set(key, createFunction());
    }
    return this.cache.get(key);
  }
}
