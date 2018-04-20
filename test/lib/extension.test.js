const assert = require('assert')

const Extension = require('../../lib/extension')

describe('Extension', () => {
  const rawExtension = {
    packageJSON: { version: '0.0.2' }
  }
  const extension = new Extension({ raw: rawExtension })

  it('finds changelogs', async () => {
    assert.ok(extension.isUpdated('0.0.1'))
  })
})
