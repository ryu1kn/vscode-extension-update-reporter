const md = require('markdown-it')()
const multiline = require('multiline-string')()

class HtmlReportGenerator {
  generate (markdownReport) {
    return multiline(`
      <html>
        <head>
          <style>
            h2 { margin-top: 3em; }
          </style>
        </head>
        <body>
          ${md.render(markdownReport)}
        </body>
      </html>`)
  }
}

module.exports = HtmlReportGenerator
