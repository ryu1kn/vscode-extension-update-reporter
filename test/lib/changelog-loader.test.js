const assert = require('assert')
const td = require('testdouble')

const ChangelogLoader = require('../../lib/changelog-loader')

describe('ChangelogLoader', () => {
  const fileSystem = td.object(['readDirectory', 'readFile'])
  td
    .when(fileSystem.readDirectory('EXTENSION_PATH'))
    .thenResolve(['CHANGELOG.md', 'package.json'])
  td
    .when(fileSystem.readFile('EXTENSION_PATH/CHANGELOG.md'))
    .thenResolve('CHANGELOG_CONTENTS')
  const changelogLoader = new ChangelogLoader({ fileSystem })

  it('loads changelog', async () => {
    const changelog = await changelogLoader.load('EXTENSION_PATH')
    assert.deepEqual(changelog, 'CHANGELOG_CONTENTS')
  })
})
