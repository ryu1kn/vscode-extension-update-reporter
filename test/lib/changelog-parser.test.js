const assert = require('assert')

const ChangelogParser = require('../../lib/changelog-parser')
const multiline = require('multiline-string')()

describe('ChangelogParser', () => {
  const changelogParser = new ChangelogParser()
  const CHANGELOG_WITH_RELEASES = multiline(`
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
  const CHANGELOG_NO_RELEASES = multiline(`
    # Change Log

    ## Unreleased
    ### Added
    - New "blah" functionality
    `)
  const CHANGELOG_NON_STANDARD = multiline(`
    ## 1.0.0
    - New "foo" functionality
    - Removed "bar" configuration
    `)

  it('gives only the unchecked changelog', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES)
    const changes = changelog.getUpdatesSince('0.0.1')
    assert.deepEqual(changes[0].version, '1.0.0')
  })

  it('gives the contents of the change', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES)
    const changes = changelog.getUpdatesSince('0.0.1')
    assert.deepEqual(changes[0].changes.added, ['New "blah" functionality'])
  })

  it('returns nothing if the changelog contains no releases', () => {
    const changelog = changelogParser.parse(CHANGELOG_NO_RELEASES)
    assert.equal(typeof changelog, 'undefined')
  })

  it('returns nothing if the changelog is not of the format of Keep a Changelog', () => {
    const changelog = changelogParser.parse(CHANGELOG_NON_STANDARD)
    assert.equal(typeof changelog, 'undefined')
  })
})
