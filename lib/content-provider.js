const HtmlReportGenerator = require('./html-report-generator')
const htmlReportGenerator = new HtmlReportGenerator()

class ContentProvider {
  constructor ({ extensionUpdatesReportGenerator }) {
    this._extensionUpdatesReportGenerator = extensionUpdatesReportGenerator
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this._extensionUpdatesReportGenerator.generate()
    return htmlReportGenerator.generate(markdownChangelog)
  }
}

module.exports = ContentProvider
