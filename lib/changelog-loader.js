const { join } = require('path')

class ChangelogLoader {
  constructor ({ fileSystem }) {
    this._fileSystem = fileSystem
  }

  async load (extensionPath) {
    const files = await this._fileSystem.readDirectory(extensionPath)
    const changelog = files.find(file => file === 'CHANGELOG.md')
    return (
      changelog && this._fileSystem.readFile(join(extensionPath, changelog))
    )
  }
}

module.exports = ChangelogLoader
