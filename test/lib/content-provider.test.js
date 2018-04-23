const assert = require('assert')
const td = require('testdouble')

const ContentProvider = require('../../lib/content-provider')
const multiline = require('multiline-string')()

describe('ContentProvider', () => {
  const displayReportCommand = td.object('execute')
  td.when(displayReportCommand.execute()).thenResolve('MARKDOWN_STRING')
  const contentProvider = new ContentProvider({ displayReportCommand })

  it('returns HTML with extension updates in it', async () => {
    const html = await contentProvider.provideTextDocumentContent()
    assert.equal(html, multiline(`
      <html>
        <head>
          <style>
            h2 { margin-top: 3em; }
          </style>
        </head>
        <body>
          <p>MARKDOWN_STRING</p>

        </body>
      </html>`))
  })
})
