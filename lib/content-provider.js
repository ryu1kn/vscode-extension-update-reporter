const md = require('markdown-it')()

class ContentProvider {
  constructor ({ displayReportCommand }) {
    this._displayReportCommand = displayReportCommand
  }

  async provideTextDocumentContent (uri) {
    const markdownString = await this._displayReportCommand.execute()
    return md.render(markdownString)
  }
}

module.exports = ContentProvider
