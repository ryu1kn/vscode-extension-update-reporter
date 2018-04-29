import HtmlReportGenerator from './html-report-generator';
import ExtensionUpdatesReportGenerator from "./extension-updates-report-generator";
import * as vscode from "vscode";
const htmlReportGenerator = new HtmlReportGenerator();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private extensionUpdatesReportGenerator: ExtensionUpdatesReportGenerator;

  constructor (params: any) {
    this.extensionUpdatesReportGenerator = params.extensionUpdatesReportGenerator;
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this.extensionUpdatesReportGenerator.generate();
    return htmlReportGenerator.generate(markdownChangelog);
  }
}
