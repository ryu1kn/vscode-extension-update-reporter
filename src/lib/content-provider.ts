import MarkdownToHtmlConverter from './markdown-to-html-converter';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import MarkdownReportGenerator from './markdown-report-generator';

const markdownToHtmlConverter = new MarkdownToHtmlConverter();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private readonly markdownReportGenerator: MarkdownReportGenerator;
  private readonly extensionStore: ExtensionStore;

  constructor(markdownReportGenerator: MarkdownReportGenerator, extensionStore: ExtensionStore) {
    this.markdownReportGenerator = markdownReportGenerator;
    this.extensionStore = extensionStore;
  }

  async provideTextDocumentContent() {
    const updatedExtensions = this.extensionStore.getUpdatedExtensions();
    const markdownReport = await this.markdownReportGenerator.generate(updatedExtensions);
    const htmlReport = markdownToHtmlConverter.convert(markdownReport);
    await this.extensionStore.persistLoadedExtensions();
    return htmlReport;
  }
}
