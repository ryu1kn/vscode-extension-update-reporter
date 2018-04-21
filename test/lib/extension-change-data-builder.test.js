const assert = require('assert')

const ExtensionChangeDataBuilder = require('../../lib/extension-change-data-builder')
const Extension = require('../../lib/extension')
const ChangelogParser = require('../../lib/changelog-parser')
const multiline = require('multiline-string')()

describe('ExtensionChangeDataBuilder', () => {
  const changelogParser = new ChangelogParser()
  const rawExtension1 = { packageJSON: { displayName: 'EXT_NAME_1' } }
  const changelog1 = changelogParser.parse(
    multiline(`
      ## [1.0.0] - 2018-04-21
      ### Added
      - foo
      - bar
      `)
  )
  const extension1 = new Extension({
    raw: rawExtension1,
    changelog: changelog1
  })
  const rawExtension2 = { packageJSON: { displayName: 'EXT_NAME_2' } }
  const changelog2 = changelogParser.parse(
    multiline(`
      ## [0.1.0] - 2018-04-22
      ### Removed
      - baz
      `)
  )
  const extension2 = new Extension({
    raw: rawExtension2,
    changelog: changelog2
  })

  it('finds changelogs', async () => {
    const builder = new ExtensionChangeDataBuilder()
    builder.add(extension1)
    builder.add(extension2)
    assert.deepEqual(
      builder.build(),
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
})
