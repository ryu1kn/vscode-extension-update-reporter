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
          packageJSON: { displayName: 'My Extension 1', version: '1.0.0' }
        },
        {
          id: 'ID_2',
          extensionPath: 'PATH_2',
          packageJSON: { displayName: 'My Extension 2', version: '1.0.0' }
        },
        {
          id: 'ID_3',
          extensionPath: 'PATH_3',
          packageJSON: { displayName: 'My Extension 3', version: '0.12.1' }
        },
        {
          id: 'ID_4',
          extensionPath: 'PATH_4',
          packageJSON: { displayName: 'No updates', version: '1.0.0' }
        }
      ]
    },
    workspace: {
      getConfiguration: key =>
        key === 'changelogChecker' && {
          get: key =>
            key === 'extensionVersions' && {
              ID_1: '0.8.0',
              ID_2: '0.1.0',
              ID_3: '0.1.0',
              ID_4: '1.0.0'
            }
        }
    }
  }

  const fileSystem = td.object(['readDirectory', 'readFile'])
  td.when(fileSystem.readDirectory('PATH_1')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_1/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-1.md'))
  td.when(fileSystem.readDirectory('PATH_2')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_2/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-2.md'))
  td.when(fileSystem.readDirectory('PATH_3')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_3/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-lv2-heading.md'))
  const commandFactory = new CommandFactory({ fileSystem, vscode })
  const extensionUpdatesReportGenerator = commandFactory.create()

  it('generates a summary', async () => {
    const result = await extensionUpdatesReportGenerator.generate()
    assert.deepEqual(result, readFileSync('./sample-report.md'))
  })

  function readFileSync (path) {
    return fs.readFileSync(join(__dirname, path), 'utf8')
  }
})
