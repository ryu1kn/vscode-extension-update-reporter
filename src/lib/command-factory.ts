import ConfigStore from './config-store';
import ExtensionStore from './extension-store';
import Main from './main';
import FileSystem from './file-system';
import ContentProvider from './content-provider';
import MarkdownReportGeneratorFactory from './markdown-report-generator-factory';

export default class CommandFactory {
  constructor(private readonly fileSystem: FileSystem,
              private readonly vscode: any) {}

  createMain() {
    const extensionStore = new ExtensionStore(new ConfigStore(this.vscode.workspace));
    return new Main(extensionStore, this.createContentProvider(), this.vscode);
  }

  private createContentProvider() {
    const markdownReportGenerator = new MarkdownReportGeneratorFactory(this.fileSystem).create();
    return new ContentProvider(markdownReportGenerator);
  }
}
