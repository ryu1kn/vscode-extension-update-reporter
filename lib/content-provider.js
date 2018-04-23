const md = require('markdown-it')()
const multiline = require('multiline-string')()

class ContentProvider {
  constructor ({ displayReportCommand }) {
    this._displayReportCommand = displayReportCommand
  }

  async provideTextDocumentContent () {
    const markdownChangelog = await this._displayReportCommand.execute()
    return this._renderHtml(md.render(markdownChangelog))
  }

  _renderHtml (htmlChangelog) {
    return multiline(`
      <html>
        <head>
          <style>
            h2 { margin-top: 3em; }
          </style>
        </head>
        <body>
          ${htmlChangelog}
        </body>
      </html>`)
  }
}

module.exports = ContentProvider
