const assert = require('assert')

const ExtensionChangeDataBuilder = require('../../lib/extension-change-data-builder')
const Extension = require('../../lib/extension')
const ChangelogParser = require('../../lib/changelog-parser')
const multiline = require('multiline-string')()

describe('ExtensionChangeDataBuilder', () => {
  const changelogParser = new ChangelogParser()
  const builder = new ExtensionChangeDataBuilder()

  it('creates an updates summary', () => {
    const extension1 = createExtension({
      displayName: 'EXT_NAME_1',
      changelogText: multiline(`
        ## [1.0.0] - 2018-04-21
        ### Added
        - foo
        - bar
        `)
    })
    const extension2 = createExtension({
      displayName: 'EXT_NAME_2',
      changelogText: multiline(`
        ## [0.1.0] - 2018-04-22
        ### Removed
        - baz
        `)
    })

    assert.deepEqual(
      builder.build([extension1, extension2]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_1
      ### [1.0.0]
      #### Added
      - foo
      - bar

      ## EXT_NAME_2
      ### [0.1.0]
      #### Removed
      - baz
      `)
    )
  })

  it('shows a message that changelog is not available', () => {
    const extension = createExtension({
      displayName: 'EXT_NAME_3',
      changelogText: multiline(`
        ### 1.3.0: 26 Jan 2018
        * Update to work with new Code version
        `)
    })
    assert.deepEqual(
      builder.build([extension]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_3
      Changelog not found or cannot be parsed as [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).
      `)
    )
  })

  function createExtension ({ displayName, changelogText }) {
    return new Extension({
      raw: { packageJSON: { displayName } },
      changelog: changelogParser.parse(changelogText)
    })
  }
})
