const assert = require('assert')
const td = require('testdouble')

const CommandFactory = require('../../lib/command-factory')
const fs = require('fs')
const { join } = require('path')

describe('Integration', () => {
  const vscode = {
    extensions: {
      all: [
        {
          id: 'ID_1',
          extensionPath: 'PATH_1',
          packageJSON: { displayName: 'My Extension 1' }
        },
        {
          id: 'ID_2',
          extensionPath: 'PATH_2',
          packageJSON: { displayName: 'My Extension 2' }
        }
      ]
    }
  }

  const fileSystem = td.object(['readDirectory', 'readFile'])
  td.when(fileSystem.readDirectory('PATH_1')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_1/CHANGELOG.md', 'utf8'))
    .thenResolve(readFileSync('./sample-changelog-1.md'))
  td.when(fileSystem.readDirectory('PATH_2')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_2/CHANGELOG.md', 'utf8'))
    .thenResolve(readFileSync('./sample-changelog-2.md'))
  const commandFactory = new CommandFactory({ fileSystem, vscode })
  const displayReportCommand = commandFactory.create()

  it('generates a summary', async () => {
    const result = await displayReportCommand.execute()
    assert.deepEqual(result, readFileSync('./sample-report.md'))
  })

  function readFileSync (path) {
    return fs.readFileSync(join(__dirname, path), 'utf8')
  }
})
