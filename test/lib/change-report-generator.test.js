const assert = require('assert')
const td = require('testdouble')

const ChangeReportGenerator = require('../../lib/change-report-generator')

describe('ChangeReportGenerator', () => {
  const vscExtensions = {
    all: [
      {
        extensionPath: 'PATH',
        id: 'ID'
      }
    ]
  }
  const fileSystem = td.object('readDirectory')

  td.when(fileSystem.readDirectory('PATH')).thenResolve(['CHANGELOG.md'])

  const changeReportGenerator = new ChangeReportGenerator({
    fileSystem,
    vscExtensions
  })

  it('finds a changelog', async () => {
    const report = await changeReportGenerator.generate()
    assert.deepEqual(report, ['CHANGELOG.md'])
  })
})
