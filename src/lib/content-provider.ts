import MarkdownToHtmlConverter from './markdown-to-html-converter';
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
const htmlReportGenerator = new MarkdownToHtmlConverter();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private generator: ExtensionUpdatesReportGenerator;
  private extensionStore: ExtensionStore;

  constructor (generator: ExtensionUpdatesReportGenerator, extensionStore: ExtensionStore) {
    this.generator = generator;
    this.extensionStore = extensionStore;
  }

  async provideTextDocumentContent () {
    const markdownReport = await this.generator.generate();
    const htmlReport = htmlReportGenerator.convert(markdownReport);
    await this.extensionStore.persistLoadedExtensions();
    return htmlReport;
  }
}
