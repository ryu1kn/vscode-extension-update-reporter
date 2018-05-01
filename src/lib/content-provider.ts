import MarkdownToHtmlConverter from './markdown-to-html-converter';
import ChangelogAssigner from './changelog-assigner';
import * as vscode from 'vscode';
import ExtensionStore from './extension-store';
import MarkdownReportBuilder from './markdown-report-builder';

const htmlReportGenerator = new MarkdownToHtmlConverter();
const markdownReportBuilder = new MarkdownReportBuilder();

export default class ContentProvider implements vscode.TextDocumentContentProvider {
  private changelogAssigner: ChangelogAssigner;
  private extensionStore: ExtensionStore;

  constructor (changelogAssigner: ChangelogAssigner, extensionStore: ExtensionStore) {
    this.changelogAssigner = changelogAssigner;
    this.extensionStore = extensionStore;
  }

  async provideTextDocumentContent () {
    const lastRecordedVersions = this.extensionStore.extensionVersions;
    const updatedExtensions = this.extensionStore.getUpdatedExtensions();
    const extensions = await this.changelogAssigner.assign(updatedExtensions, lastRecordedVersions);
    const markdownReport = markdownReportBuilder.build(extensions);
    const htmlReport = htmlReportGenerator.convert(markdownReport);
    await this.extensionStore.persistLoadedExtensions();
    return htmlReport;
  }
}
