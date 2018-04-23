const HtmlReportGenerator = require('./html-report-generator')
const htmlReportGenerator = new HtmlReportGenerator()

class ContentProvider {
  constructor ({ displayReportCommand }) {
    this._displayReportCommand = displayReportCommand
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this._displayReportCommand.execute()
    return htmlReportGenerator.generate(markdownChangelog)
  }
}

module.exports = ContentProvider
