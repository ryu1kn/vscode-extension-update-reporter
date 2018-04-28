import HtmlReportGenerator from './html-report-generator';
import ExtensionUpdatesReportGenerator from "./extension-updates-report-generator";
const htmlReportGenerator = new HtmlReportGenerator();

export default class ContentProvider {
  private extensionUpdatesReportGenerator: ExtensionUpdatesReportGenerator;

  constructor (params: any) {
    this.extensionUpdatesReportGenerator = params.extensionUpdatesReportGenerator;
  }

  async provideTextDocumentContent (): Promise<string> {
    const markdownChangelog = await this.extensionUpdatesReportGenerator.generate();
    return htmlReportGenerator.generate(markdownChangelog);
  }
}
