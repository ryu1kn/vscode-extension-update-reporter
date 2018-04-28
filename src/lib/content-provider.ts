import HtmlReportGenerator from './html-report-generator';
import ExtensionUpdatesReportGenerator from "./extension-updates-report-generator";
const htmlReportGenerator = new HtmlReportGenerator();

class ContentProvider {
  private _extensionUpdatesReportGenerator: ExtensionUpdatesReportGenerator;

  constructor (params: any) {
    this._extensionUpdatesReportGenerator = params.extensionUpdatesReportGenerator;
  }

  async provideTextDocumentContent (): Promise<string> {
    const markdownChangelog = await this._extensionUpdatesReportGenerator.generate();
    return htmlReportGenerator.generate(markdownChangelog);
  }
}

export default ContentProvider;
