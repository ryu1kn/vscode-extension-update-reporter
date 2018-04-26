const { join } = require('path')

class ChangelogLoader {
  constructor ({ fileSystem, changelogParser }) {
    this._fileSystem = fileSystem
    this._changelogParser = changelogParser
  }

  async load (extensionPath, knownVersion) {
    const files = await this._fileSystem.readDirectory(extensionPath)
    const changelog = files.find(file => file === 'CHANGELOG.md')
    if (!changelog) return

    const changelogContents = await this._fileSystem.readFile(
      join(extensionPath, changelog)
    )
    return this._changelogParser.parse(changelogContents, knownVersion)
  }
}

module.exports = ChangelogLoader
