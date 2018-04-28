import HtmlReportGenerator from './html-report-generator'
const htmlReportGenerator = new HtmlReportGenerator()

class ContentProvider {
  private _extensionUpdatesReportGenerator: any

  constructor (params: any) {
    this._extensionUpdatesReportGenerator = params.extensionUpdatesReportGenerator
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this._extensionUpdatesReportGenerator.generate()
    return htmlReportGenerator.generate(markdownChangelog)
  }
}

export default ContentProvider
