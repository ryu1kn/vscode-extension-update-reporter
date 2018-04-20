const assert = require('assert')
const td = require('testdouble')

const ChangeReportGenerator = require('../../lib/change-report-generator')

describe('ChangeReportGenerator', () => {
  const vscExtensions = {
    all: [
      { extensionPath: 'EXT_PATH1', id: 'ID1' },
      { extensionPath: 'EXT_PATH2', id: 'ID2' }
    ]
  }
  const changelogLoader = td.object('load')
  td.when(changelogLoader.load('EXT_PATH1')).thenResolve('EXT_CHANGELOG1')
  td.when(changelogLoader.load('EXT_PATH2')).thenResolve('EXT_CHANGELOG2')

  const changeReportGenerator = new ChangeReportGenerator({
    changelogLoader,
    vscExtensions
  })

  it('finds changelogs', async () => {
    const report = await changeReportGenerator.generate()
    assert.deepEqual(report, ['EXT_CHANGELOG1', 'EXT_CHANGELOG2'])
  })
})
