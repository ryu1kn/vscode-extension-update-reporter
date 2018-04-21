const assert = require('assert')
const td = require('testdouble')

const DisplayReportCommand = require('../../lib/display-report-command')
const multiline = require('multiline-string')()

describe('DisplayReportCommand', () => {
  const vscExtensions = {
    all: [
      {
        id: 'ID1',
        extensionPath: 'EXT_PATH1',
        packageJSON: { displayName: 'EXTENSION1' }
      },
      {
        id: 'ID2',
        extensionPath: 'EXT_PATH2',
        packageJSON: { displayName: 'EXTENSION2' }
      }
    ]
  }
  const changelogLoader = td.object('load')
  td.when(changelogLoader.load('EXT_PATH1')).thenResolve('EXT_CHANGELOG1')
  td.when(changelogLoader.load('EXT_PATH2')).thenResolve('EXT_CHANGELOG2')

  const displayReportCommand = new DisplayReportCommand({
    changelogLoader,
    vscExtensions
  })

  it("shows the extension's update information", async () => {
    const report = await displayReportCommand.execute()
    assert.deepEqual(
      report,
      multiline(`
      # Extension Updates

      ## EXTENSION1
      EXT_CHANGELOG1

      ## EXTENSION2
      EXT_CHANGELOG2
      `)
    )
  })
})
