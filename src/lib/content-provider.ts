import MarkdownToHtmlConverter from './markdown-to-html-converter';
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator';
import * as vscode from 'vscode';
const htmlReportGenerator = new MarkdownToHtmlConverter();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private generator: ExtensionUpdatesReportGenerator;

  constructor (generator: ExtensionUpdatesReportGenerator) {
    this.generator = generator;
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this.generator.generate();
    return htmlReportGenerator.convert(markdownChangelog);
  }
}
