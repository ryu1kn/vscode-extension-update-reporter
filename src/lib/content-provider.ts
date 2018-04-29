import HtmlReportGenerator from './html-report-generator';
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator';
import * as vscode from 'vscode';
const htmlReportGenerator = new HtmlReportGenerator();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private generator: ExtensionUpdatesReportGenerator;

  constructor (generator: ExtensionUpdatesReportGenerator) {
    this.generator = generator;
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this.generator.generate();
    return htmlReportGenerator.generate(markdownChangelog);
  }
}
