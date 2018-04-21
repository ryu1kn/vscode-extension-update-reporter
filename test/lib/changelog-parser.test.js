const assert = require('assert')

const ChangelogParser = require('../../lib/changelog-parser')
const multiline = require('multiline-string')()

describe('ChangelogParser', () => {
  const changelogParser = new ChangelogParser()
  const changelogString = multiline(`
    # Change Log

    All notable changes to "My Extension" extension will be documented in this file.
    
    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
    and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
    
    ## [1.0.0] - 2018-04-21
    ### Added
    - New "blah" functionality

    ## [0.0.1] - 2018-04-11
    ### Added
    * Initial release of My Extension
    `)
  const changelog = changelogParser.parse(changelogString)

  it('gives only the unchecked changelog', async () => {
    const changes = changelog.getUpdatesSince('0.0.1')
    assert.deepEqual(changes[0].version, '1.0.0')
  })

  it('gives the contents of the change', async () => {
    const changes = changelog.getUpdatesSince('0.0.1')
    assert.deepEqual(changes[0].changes.added, ['New "blah" functionality'])
  })
})
