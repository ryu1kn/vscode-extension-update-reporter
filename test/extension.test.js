const assert = require('assert')
const td = require('testdouble')

const CommandFactory = require('../lib/command-factory')
const multiline = require('multiline-string')()

describe('High-level test', () => {
  const vscode = {
    extensions: {
      all: [
        {
          id: 'ID_1',
          extensionPath: 'PATH_1',
          packageJSON: { displayName: 'My Extension' }
        }
      ]
    }
  }
  const CHANGELOG = multiline(`
    # Change Log

    All notable changes to "My Extension" extension will be documented in this file.
    
    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
    and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
    
    ## [1.0.0] - 2018-04-21
    ### Added
    - New "blah" functionality

    ## [0.0.1] - 2018-04-11
    ### Added
    - Initial release of My Extension
    `)
  const fileSystem = td.object(['readDirectory', 'readFile'])
  td.when(fileSystem.readDirectory('PATH_1')).thenResolve(['CHANGELOG.md'])
  td
    .when(fileSystem.readFile('PATH_1/CHANGELOG.md', 'utf8'))
    .thenResolve(CHANGELOG)
  const commandFactory = new CommandFactory({ fileSystem, vscode })

  it('generates a summary', async () => {
    const displayReportCommand = commandFactory.create()
    const result = await displayReportCommand.execute()
    assert.deepEqual(
      result,
      multiline(`
      # Extension Updates
      
      ## My Extension
      ### [1.0.0]
      #### Added
      - New "blah" functionality
      
      ### [0.0.1]
      #### Added
      - Initial release of My Extension
      `)
    )
  })
})
