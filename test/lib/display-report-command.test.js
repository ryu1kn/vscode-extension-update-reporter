const assert = require('assert')
const td = require('testdouble')

const DisplayReportCommand = require('../../lib/display-report-command')

describe('DisplayReportCommand', () => {
  const vscExtensions = {
    all: [
      { extensionPath: 'EXT_PATH1', id: 'ID1' },
      { extensionPath: 'EXT_PATH2', id: 'ID2' }
    ]
  }
  const changelogLoader = td.object('load')
  td.when(changelogLoader.load('EXT_PATH1')).thenResolve('EXT_CHANGELOG1')
  td.when(changelogLoader.load('EXT_PATH2')).thenResolve('EXT_CHANGELOG2')

  const displayReportCommand = new DisplayReportCommand({
    changelogLoader,
    vscExtensions
  })

  it('finds changelogs', async () => {
    const report = await displayReportCommand.execute()
    assert.deepEqual(report, ['EXT_CHANGELOG1', 'EXT_CHANGELOG2'])
  })
})
